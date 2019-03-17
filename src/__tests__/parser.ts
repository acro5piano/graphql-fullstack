import gql from 'graphql-tag'
import { buildSchema } from '@app/parser'

const schemaStructure = gql`
  type User {
    id: Int!
    name: String!
  }

  type Query {
    hello: String
  }

  extend type Query {
    hello: String @resolver(path: "hello")
    user: User @resolver(path: "user")
  }
`

console.log(JSON.stringify(schemaStructure, undefined, 2))

export const schema = buildSchema(schemaStructure)
