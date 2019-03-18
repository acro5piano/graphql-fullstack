import { gql } from '@app/__tests__/test-utils'
import { buildSchemaFromString } from '@app/parser/parser'

const schema = gql`
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

console.log(JSON.stringify(schema, undefined, 2))

buildSchemaFromString(schema)
