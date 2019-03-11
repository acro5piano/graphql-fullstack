import * as express from 'express'
import * as bodyParser from 'body-parser'
import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  // GraphQLID,
  // GraphQLList,
  // GraphQLString,
} from 'graphql'
import { typeDefs } from '@app/store'

function mapQueryType(queryType: any) {
  const fields = Object.keys(queryType).reduce((acc, cur) => {
    const type = typeDefs.get(queryType[cur].typeName)
    return {
      ...acc,
      [cur]: {
        type: new GraphQLObjectType(type),
        resolve(_: any, { id }: any) {
          return { id, name: 'kazuya' }
        },
        // args: {
        //   id: {
        //     type: GraphQLID,
        //   },
        // },
      },
    }
  }, {})
  return fields
}

function getSchema() {
  const fields = mapQueryType(typeDefs.get('Query').fields)
  const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields,
    }),
  })

  return schema
}

export const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(require('cors')())

app.post('/graphql', (req, res) => {
  const schema = getSchema()
  graphql(schema, req.body.query).then(result => {
    res.send(result)
  })
})
