import { GraphQLInt, GraphQLString } from 'graphql'
import { type, withResolver, withArgs, decorate, run } from '@app/index'

const userResolver = withResolver((_root, { id }) => ({ id, name: 'kazuya' }))
const userArgs = withArgs({
  id: {
    type: GraphQLInt,
  },
})

type('User', {
  id: GraphQLInt,
  name: GraphQLString,
})

type('Query', {
  user: decorate('User', userResolver, userArgs),
})

run()
