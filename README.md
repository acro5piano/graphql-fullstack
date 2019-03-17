[![npm version](https://badge.fury.io/js/graphql-fullstack.svg)](https://badge.fury.io/js/graphql-fullstack)

# graphql-fullstack

Experimental GraphQL-oriented web framework.

Inspired by https://github.com/nuwave/lighthouse

# Install

```
npm install --save graphql-fullstack
```

Or if you use Yarn:

```
yarn add graphql-fullstack
```

# Usage

First, write your schema:

`schema.graphql`

```graphql
type Query {
  id: Int @resolver(path: "idResolver")
  hello: String @resolver(path: "helloResolver")
}
```

Then run GraphQL server:

```sh
node node_modules/.bin/graphql-fullstack --schema schema.graphql
# => running on http://localhost:5252
```

Now you can request GraphQL:

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
