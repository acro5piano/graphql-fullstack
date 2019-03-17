import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'
import { getConfig, setCustomType, getCustomType } from '@app/store'
import path from 'path'

interface GraphQLName {
  kind: 'Name'
  value: string
}

interface Argument {
  value: {
    value: string
  }
}

interface GraphQLDirective {
  arguments: Argument[]
}

interface GraphQLInterface {}

interface GraphQLType {
  kind: 'NamedType' | 'NonNullType' | 'TypedName' | 'Name'
  name?: string | GraphQLName
  type?: GraphQLType
}

type GraphQLKind = 'Document' | 'ObjectTypeDefinition' | 'FieldDefinition'

interface GraphQLTree {
  kind: GraphQLKind
  name: GraphQLName
  interfaces: GraphQLInterface[]
  directives: GraphQLDirective[]
  fields: GraphQLTree[]
  type: GraphQLType
  arguments?: any[]
  definitions?: GraphQLTree[]
}

function getTypeName(type: GraphQLType): string | GraphQLName {
  if (type.name) {
    return type.name
  }
  if (!type.type || !type.type.name || typeof type.type.name === 'string') {
    throw new Error(`type is wrong: ${type}`)
  }

  return type.type.name.value
}

function wrapNonNull(type: GraphQLType) {
  if (type.kind === 'NonNullType') {
    return (childType: any) => new GraphQLNonNull(childType)
  }
  return (childType: any) => childType
}

function getType(type: GraphQLType) {
  const wrapperFn = wrapNonNull(type)
  const typeName = getTypeName(type)

  if (typeof typeName === 'string' || !typeName.value) {
    switch (typeName) {
      case 'String':
        return wrapperFn(GraphQLString)
      case 'Int':
        return wrapperFn(GraphQLInt)
    }
    throw new Error(`cannot get type: ${typeName}`)
  }

  switch (typeName.value) {
    case 'String':
      return wrapperFn(GraphQLString)
    case 'Int':
      return wrapperFn(GraphQLInt)
  }

  return getCustomType(typeName.value)
}

function getResolverPath(resolver: string) {
  const { resolvers } = getConfig()
  return path.resolve(`${resolvers}/${resolver}`)
}

function getDefault(obj: any) {
  return obj.default ? obj.default : obj
}

function getResolver(directive?: GraphQLDirective) {
  if (!directive || !directive.arguments[0]) {
    return undefined
  }

  const path = directive.arguments[0].value.value
  return getDefault(require(getResolverPath(path)))
}

async function getDocumentType(definitions: GraphQLTree[]) {
  const typeDefs = definitions.filter(def => !['Query', 'Mutation'].includes(def.name.value))
  const types = await Promise.all(typeDefs.map(def => buildSchema(def)))

  const queryDef = definitions.find(def => def.name.value === 'Query')
  if (!queryDef) {
    throw new Error('cannot find Query definition')
  }
  const query = await buildSchema(queryDef)

  return new GraphQLSchema({ query, types } as any)
}

async function getObjectTypeDefinition(name: string, schemaFields: GraphQLTree[]) {
  let fields = {}
  for (const field of schemaFields) {
    fields = { ...fields, ...(await getFieldDefinitions(field)) }
  }
  const type = new GraphQLObjectType({
    name,
    fields,
  } as any)
  setCustomType(name, type)
  return type
}

interface GraphQLField {
  type: GraphQLType
  directives: GraphQLDirective[]
  name: GraphQLName
}

async function getFieldDefinitions(field: GraphQLField) {
  const resolve = getResolver(field.directives[0])
  const type = getType(field.type)
  return {
    [field.name.value]: {
      type,
      resolve,
    },
  } as any
}

export async function buildSchema(
  schemaStructure: GraphQLTree,
): Promise<GraphQLSchema | GraphQLObjectType> {
  if (schemaStructure.kind === 'Document' && schemaStructure.definitions) {
    return getDocumentType(schemaStructure.definitions)
  }

  if (schemaStructure.kind === 'ObjectTypeDefinition') {
    return getObjectTypeDefinition(schemaStructure.name.value, schemaStructure.fields)
  }

  // Does this needed...?
  // if (schemaStructure.kind === 'FieldDefinition') {
  //   return getFieldDefinitions(schemaStructure)
  // }

  throw new Error('cannot parse')
}
