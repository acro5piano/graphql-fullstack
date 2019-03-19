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

# Getting Started

First, write your schema and resolver:

`schema.graphql`

```graphql
type Query {
  hello: String @field(resolver: "hello")
}
```

`resolvers/hello.js`

```javascript
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

# Directives

GraphQL-Fullstack will have various kind of directives.

**@create**

Create given model type from `input` variables.

```graphql
type User {
  id: String!
  name: String
}

input UserInput {
  name: String
}

type Mutation {
  createUser(input: UserInput!): User @create(type: User)
}
```

**@all**

Read all data of given model type.

```graphql
type User {
  id: String!
  name: String
}

type Query {
  users: [User] @all(type: User)
}
```

**@field**

Manually resolve a field. `resolver` argument is the file name of the resolver. It defaults to `./resolvers`, but you can change it by config file (see below).

```graphql
type User {
  id: String!
  name: String
}

type Query {
  user: User @field(resolver: 'UserResolver')
}
```

# Config

You can change the path of your project.

Create `graphql.config.js` file and run `npx graphql-fullstack` with `-c` or `--config` option.

```javascript
const { resolve } = require('path')

module.exports = {
  basePath: resolve(__dirname),

  // Resolver search paths.
  resolvers: [
    // By default, $PWD/resolvers is set, but you can set other resolver paths.
    resolve(__dirname, 'path/to/your/resolvers'),
  ],
}
```

```
npx graphql-fullstack -c graphql.config.js
```

# CRUD example

```graphql
type User {
  id: String!
  name: String
}

input UserInput {
  name: String
}

type Query {
  users: [User] @all(type: User)
}

type Mutation {
  createUser(input: UserInput!): User @create(type: User)
}
```

# Roadmap

- [x] Basic GraphQL features
  - [x] Resolver
  - [x] Input type
- [x] Use MongoDB to store relational data [opinionated]
  - [ ] create
  - [ ] read
    - all
    - find
    - where
  - [ ] update
  - [ ] delete
- [ ] Middleware

```

```
