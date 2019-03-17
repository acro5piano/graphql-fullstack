# graphql-fullstack

Experimental GraphQL-oriented web framework.

Inspired by https://github.com/nuwave/lighthouse

# Usage

The syntax is as simple as possible.

```graphql
type Query {
  id: Int @resolver(path: "idResolver")
  hello: String @resolver(path: "helloResolver")
}
```

```sh
curl -XPOST localhost:5252/graphql -d query='query Hello { id hello }'
```

returns

```json
{
  "data": {
    "id": 1,
    "hello": "world"
  }
}
```

# Roadmap

- [ ] Basic GraphQL features
  - [ ] Resolver
  - [ ] Input type
- [ ] Middleware
- [ ] Use MongoDB to store relational data [opinionated]
