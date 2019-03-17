// export const typeDefs = new Map<string, any>()
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

export function setConfig(config: Config) {
  if (!config.resolvers) {
    config.resolvers = `${config.basePath}/resolvers`
  }
  if (!config.directives) {
    config.directives = `${config.basePath}/directives`
  }
  _store.set('config', config)
}

export function getConfig(): Config {
  return _store.get('config')
}
