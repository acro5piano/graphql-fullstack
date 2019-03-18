import { GraphQLType } from 'graphql'

const _store = new Map<string, any>()
const customTypeStore = new Map<string, GraphQLType>()

export function setSchema(schema: any) {
  _store.set('schema', schema)
}

export function getSchema() {
  return _store.get('schema')
}

/*
 * Application config structure.
 */
interface Config {
  basePath: string
  resolvers: string
  directives: string[]
}

const defualtConfig: Config = {
  basePath: process.cwd(),
  resolvers: `${process.cwd()}/resolvers`,
  directives: [`${process.cwd()}/directives`],
}

const forcedDirectives = [
  `${__dirname}/directives`,
  `${__dirname}/../dist`,
  `${__dirname}/../node_modules/graphql-fullstack/dist`,
  `${__dirname}/`,
]

export function setConfig(config: Config) {
  const mergedConfig = { ...defualtConfig, ...config }
  mergedConfig.directives.push(...forcedDirectives)
  _store.set('config', mergedConfig)
}

export function getConfig(): Config {
  return _store.get('config')
}

export function setCustomType(name: string, type: GraphQLType) {
  customTypeStore.set(name, type)
}

export function getCustomType(name: string): GraphQLType {
  const type = customTypeStore.get(name)
  if (!type) {
    throw new Error(`no such type: ${name}`)
  }
  return type
}
