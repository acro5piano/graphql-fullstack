import { typeDefs } from '@app/store'

function simpleTypeToGraphQLType(name: string, schema: object) {
  const fields = Object.keys(schema).reduce((acc, field) => {
    const options = (schema as any)[field]
    return {
      ...acc,
      [field]: {
        type: 'typeName' in options ? undefined : options,
        ...options,
      },
    }
  }, {})

  return { name, fields }
}

export function type(name: string, schema: any) {
  typeDefs.set(name, simpleTypeToGraphQLType(name, schema))
}
