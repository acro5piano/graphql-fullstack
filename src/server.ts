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

export const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('cors')())

app.post('/graphql', (req, res) => {
  graphql(schema, req.body.query).then(result => {
    res.send(result)
  })
})
