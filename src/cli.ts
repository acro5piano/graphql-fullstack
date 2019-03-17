import { readFile } from 'fs'
import { promisify } from 'util'
import graphql from 'graphql-tag'
import { run } from '@app/server'
import { setSchema, setConfig } from '@app/store'
import { buildSchema } from '@app/parser'
import program from 'commander'
const { version } = require('../package.json')

const readFilePromise = promisify(readFile)

function requireFromCwd(path: string) {
  return require(`${process.cwd()}/${path}`)
}

export async function main(argv: any) {
  program
    .version(version)
    .option('-s, --schema [schema]', 'Graphql schema file')
    .option('-c, --config [config]', 'Config file')
    .parse(argv)

  const schemaString = await readFilePromise(program.schema, 'utf8')
  const config = program.config ? requireFromCwd(program.config) : {}

  setConfig(config)
  const schema = await buildSchema(graphql(schemaString))
  setSchema(schema)

  run()
}
