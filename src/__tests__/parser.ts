import gql from 'graphql-tag'
import { buildSchema } from '@app/parser'

const schemaStructure = gql`
  type Query {
    hello: String
  }
`

console.log(JSON.stringify(schemaStructure, undefined, 2))

export const schema = buildSchema(schemaStructure)
