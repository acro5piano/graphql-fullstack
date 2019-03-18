import { readFile } from 'fs'
import { promisify } from 'util'
import { printSchema } from 'graphql'
import graphql from 'graphql-tag'
import { runserver } from '@app/server'
import { setSchema, setConfig } from '@app/store'
import { buildSchema } from '@app/parser/parser'
import program from 'commander'
import { init } from '@app/database/mongodb'
const { version } = require('../package.json')

const readFilePromise = promisify(readFile)

function requireFromCwd(path: string) {
  return require(`${process.cwd()}/${path}`)
}

export async function main(argv: any) {
  program
    .version(version)
    .option('-c, --config [config]', 'Config file')
    .option('-s, --schema [schema]', 'Graphql schema file')

  program.command('print')

  program.command('serve')

  program.parse(argv)

  const config = program.config ? requireFromCwd(program.config) : {}
  setConfig(config)

  const schemaString = await readFilePromise(program.schema, 'utf8')
  const schema = await buildSchema(graphql(schemaString))
  setSchema(schema)

  const command = program.args[0]
  switch (program.args[0]) {
    case 'serve':
      await init()
      runserver()
      break
    case 'print':
      console.log(printSchema(schema as any))
      break
    default:
      console.log(`Error: Unknown command: ${command}`)
      process.exit(1)
  }
}
