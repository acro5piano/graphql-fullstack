import { promisify } from 'util'
import { exists } from 'fs'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} from 'graphql'
import { setCustomType, getCustomType } from '@app/store'
import {
  GraphQLName,
  GraphQLDirective,
  GraphQLType,
  GraphQLField,
  GraphQLTree,
} from '@app/parser/interfaces'
import { getDefault } from '@app/utils'
import { getConfig } from '@app/store'

const existsPromise = promisify(exists)

function getTypeName(type: GraphQLType): string | GraphQLName {
  if (type.name) {
    return type.name
  }
  if (!type.type || !type.type.name || typeof type.type.name === 'string') {
    throw new Error(`type is wrong: ${type}`)
  }

  return type.type.name.value
}

function getTypeWrapper(type: GraphQLType) {
  if (type.kind === 'NonNullType') {
    return (childType: any) => new GraphQLNonNull(childType)
  }
  if (type.kind === 'ListType') {
    return (childType: any) => new GraphQLList(childType)
  }
  return (childType: any) => childType
}

function getType(type: GraphQLType) {
  const wrapperFn = getTypeWrapper(type)
  const typeName = getTypeName(type)

  if (typeof typeName === 'string' || !typeName.value) {
    switch (typeName) {
      case 'String':
        return wrapperFn(GraphQLString)
      case 'Int':
        return wrapperFn(GraphQLInt)
    }

    if (typeof typeName === 'string') {
      return wrapperFn(getCustomType(typeName))
    }

    console.log(typeName)
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

async function getObjectTypeDefinition(name: string, schemaFields: GraphQLField[]) {
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

export async function getDirective(directive: GraphQLDirective) {
  const { directives } = getConfig()
  const exts = ['.ts', '.js']
  for (const directiveDir of directives) {
    for (const ext of exts) {
      if (await existsPromise(`${directiveDir}/${directive.name.value}${ext}`)) {
        return getDefault(await import(`${directiveDir}/${directive.name.value}`))
      }
    }
  }
  throw new Error('directive not found')
}

async function applyFieldDirectives(field: GraphQLField) {
  let _field = field
  for (const directive of field.directives) {
    const directiveFn = await getDirective(directive)
    _field = await directiveFn(field, directive)
  }
  return _field
}

async function getFieldDefinitions(field: GraphQLField) {
  let withResolverField: GraphQLField = await applyFieldDirectives(field)
  const type = getType(field.type)
  return {
    [withResolverField.name.value]: {
      type,
      resolve: withResolverField.__resolver,
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
