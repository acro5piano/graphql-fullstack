import * as express from 'express'
import * as bodyParser from 'body-parser'
import { graphql, GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
// import { typeDefs } from '@app/store'

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world'
        },
      },
    },
  }),
})

export const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(require('cors')())

server.post('/graphql', (req, res) => {
  graphql(schema, req.body.query).then(result => {
    res.send(result)
  })
})
