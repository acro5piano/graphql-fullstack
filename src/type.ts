import { typeDefs } from '@app/store'
// import { GraphQLList, GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql'
import { GraphQLID } from 'graphql'

function simpleTypeToGraphQLType(name: string, schema: object) {
  const fields = Object.keys(schema).reduce((acc, field) => {
    const typeName = (schema as any)[field]
    return {
      ...acc,
      [field]: {
        type: GraphQLID,
        typeName,
      },
    }
  }, {})

  if (name === 'Query') {
    // console.log(schema)
    // const UserType = typeDefs.get('User')
    // console.log(UserType)
    // console.log({ name, fields })
  }
  return { name, fields }
}

export function type(name: string, schema: any) {
  typeDefs.set(name, simpleTypeToGraphQLType(name, schema))
}
