import { promisify } from 'util'
import { exists } from 'fs'
import graphql from 'graphql-tag'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLInputObjectType,
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

  const mutationDef = definitions.find(def => def.name.value === 'Mutation')
  const mutation = mutationDef ? await buildSchema(mutationDef) : undefined

  return new GraphQLSchema({ query, mutation, types } as any)
}

type ObjectTypeInitiater = 'object' | 'input'

async function getObjectTypeDefinition(
  name: string,
  schemaFields: GraphQLField[],
  initiater: ObjectTypeInitiater,
) {
  let fields = {}
  for (const field of schemaFields) {
    fields = { ...fields, ...(await getFieldDefinitions(field)) }
  }
  const args = { name, fields }
  const type =
    initiater === 'input' ? new GraphQLInputObjectType(args) : new GraphQLObjectType(args)
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

// function parseArgumentField(argument

async function getFieldDefinitions(field: GraphQLField) {
  const type = getType(field.type)
  if (field.kind === 'InputValueDefinition') {
    return {
      [field.name.value]: {
        type,
      },
    }
  }

  const args = field.arguments.reduce(
    (acc, argument) => ({
      ...acc,
      [argument.name.value]: {
        type: getType(argument.type),
      },
    }),
    {},
  )

  let withResolverField: GraphQLField = await applyFieldDirectives(field)
  return {
    [withResolverField.name.value]: {
      type,
      args,
      resolve: withResolverField.__resolver,
    },
  } as any
}

async function buildSchema(
  schemaStructure: GraphQLTree,
): Promise<GraphQLSchema | GraphQLObjectType | GraphQLInputObjectType> {
  if (schemaStructure.kind === 'Document' && schemaStructure.definitions) {
    return getDocumentType(schemaStructure.definitions)
  }

  if (schemaStructure.kind === 'ObjectTypeDefinition') {
    return getObjectTypeDefinition(schemaStructure.name.value, schemaStructure.fields, 'object')
  }

  if (schemaStructure.kind === 'InputObjectTypeDefinition') {
    return getObjectTypeDefinition(schemaStructure.name.value, schemaStructure.fields, 'input')
  }
  console.log(schemaStructure)

  // Does this needed...?
  // if (schemaStructure.kind === 'FieldDefinition') {
  //   return getFieldDefinitions(schemaStructure)
  // }

  throw new Error('cannot parse')
}

export function buildSchemaFromString(schema: string) {
  return buildSchema(graphql(schema))
}
