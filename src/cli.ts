import * as path from 'path'
import graphql from 'graphql-tag'
import { run } from '@app/server'
import { setSchema, setConfig } from '@app/store'
import { buildSchema } from '@app/parser'

const schemaString = `
  type Query {
    id: Int @resolver(path: "idResolver")
    hello: String @resolver(path: "helloResolver")
  }
`

const schemaStructure = graphql(schemaString)

const config = {
  basePath: path.resolve(__dirname),
  resolvers: path.resolve(__dirname, '__tests__', 'resolvers'),
}

async function main() {
  setConfig(config)
  const schema = await buildSchema(schemaStructure)
  setSchema(schema)
  run()
}

main()
