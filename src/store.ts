export const _store = new Map<string, any>()

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
  resolvers?: string
  directives?: string
}

const defualtConfig: Config = {
  basePath: process.cwd(),
  resolvers: `${process.cwd()}/resolvers`,
  directives: `${process.cwd()}/directives`,
}

export function setConfig(config: Config) {
  _store.set('config', { ...defualtConfig, ...config })
}

export function getConfig(): Config {
  return _store.get('config')
}
