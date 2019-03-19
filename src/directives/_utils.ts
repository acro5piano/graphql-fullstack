import { GraphQLDirective } from '@app/parser/interfaces'

export function getDirectiveArgument(directive: GraphQLDirective, argument: string) {
  const type = directive.arguments.find(a => a.name.value === argument)
  if (!type) {
    throw new Error('directive argument `type` not found')
  }
  return type.value.value
}
