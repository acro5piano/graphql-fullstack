import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql'
import { getConfig } from '@app/store'
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
  kind: 'NamedType'
  name: GraphQLName
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

function getType(type: string) {
  switch (type) {
    case 'String':
      return GraphQLString
    case 'String!':
      return new GraphQLNonNull(GraphQLString)
    case 'Int':
      return GraphQLInt
    case 'Int!':
      return new GraphQLNonNull(GraphQLInt)
  }

  throw new Error('cannot get type')
}

function getResolverPath(resolver: string) {
  const { resolvers } = getConfig()
  return path.resolve(`${resolvers}/${resolver}`)
}

function getDefault(obj: any) {
  return obj.default ? obj.default : obj
}

export async function buildSchema(
  schemaStructure: GraphQLTree,
): Promise<GraphQLSchema | GraphQLObjectType> {
  if (schemaStructure.kind === 'Document' && schemaStructure.definitions) {
    const query = await buildSchema(schemaStructure.definitions[0])
    return new GraphQLSchema({ query } as any)
  }

  if (schemaStructure.kind === 'ObjectTypeDefinition') {
    let fields = {}
    for (const field of schemaStructure.fields) {
      fields = { ...fields, ...(await buildSchema(field)) }
    }
    return new GraphQLObjectType({
      name: schemaStructure.name.value,
      fields,
    } as any)
  }

  if (schemaStructure.kind === 'FieldDefinition') {
    const path = schemaStructure.directives[0].arguments[0].value.value
    const helloResolver = getDefault(require(getResolverPath(path)))
    return {
      [schemaStructure.name.value]: {
        type: getType(schemaStructure.type.name.value),
        resolve: helloResolver,
      },
    } as any
  }

  throw new Error('cannot parse')
}

// export const schema = new GraphQLSchema({
//   query: new GraphQLObjectType({
//     name: 'RootQueryType',
//     fields: {
//       hello: {
//         type: GraphQLString,
//         resolve: helloResolver,
//       },
//     },
//   }),
// })

// const schemaStructure = gql`
//   type User {
//     id: ID!
//     posts: [Post] @hasMany
//   }
//
//   type Post {
//     id: ID!
//     title: String!
//   }
//
//   type Query {
//     user: User
//   }
// `
