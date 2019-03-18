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

First, write your schema and resolver:

`schema.graphql`

```graphql
type Query {
  hello: String @field(resolver: "hello")
}
```

`resolvers/hello.js`

```js
module.exports = () => 'world'
```

Then run GraphQL server:

```sh
npx graphql-fullstack serve --schema schema.graphql
# => running on http://localhost:5252
```

Now you can request GraphQL:

```sh
curl -XPOST localhost:5252/graphql -d query='query Hello { hello }'
```

returns

```json
{
  "data": {
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
