# graphql-fullstack

Experimental GraphQL-oriented web framework.

Inspired by https://github.com/nuwave/lighthouse

# Usage

The syntax is as simple as possible.

```typescript
import { type, types, run } from '@app/index'

type('User', {
  id: types.number,
  name: types.string,
})

type('Query', {
  user: 'User',
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
