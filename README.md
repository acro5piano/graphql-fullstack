# graphql-fullstack

Experimental GraphQL-oriented web framework.

Inspired by https://github.com/nuwave/lighthouse

# Usage

The syntax is as simple as possible.

```typescript
import { GraphQLInt, GraphQLString } from 'graphql'
import { type, withResolver, withArgs, decorate, run } from '@app/index'

const userResolver = withResolver((_root, { id }) => ({
  id,
  name: 'kazuya',
}))
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
```

```sh
curl -XPOST localhost:5252/graphql -d query='query GetUser { user { id name } }'
```

returns

```json
{
  "data": {
    "user": {
      "id": 1,
      "name": "kazuya"
    }
  }
}
```

# Roadmap

- [ ] Basic GraphQL features
  - [ ] Resolver
  - [ ] Input type
- [ ] Middleware
- [ ] Use MongoDB to store data [opinionated]
