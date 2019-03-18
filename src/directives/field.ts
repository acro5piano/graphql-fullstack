import path from 'path'
import { getConfig } from '@app/store'
import { GraphQLDirective, GraphQLField } from '@app/parser/interfaces'
import { getDefault } from '@app/utils'

function getResolverPath(resolver: string) {
  const { resolvers } = getConfig()
  return path.resolve(`${resolvers}/${resolver}`)
}

function getResolver(directive?: GraphQLDirective) {
  if (!directive || !directive.arguments[0]) {
    return undefined
  }

  const path = directive.arguments[0].value.value
  return getDefault(require(getResolverPath(path)))
}

function resolveField(field: GraphQLField, directive: GraphQLDirective) {
  const resolver = getResolver(directive)
  field.__resolver = resolver
  return field
}

export default resolveField
