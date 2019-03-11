import * as express from 'express'
import * as bodyParser from 'body-parser'
import { graphql, GraphQLSchema, GraphQLObjectType } from 'graphql'
import { typeDefs } from '@app/store'

// function compileToSchemaRecursive(queryType: any) {
//   if ('typeName' in queryType) {
//     return new GraphQLObjectType(type),
//   }
// }

function mapQueryType(queryType: any) {
  // console.log(typeDefs.get('Post'))
  // console.log(typeDefs.get('User').fields)
  const fields = Object.keys(queryType).reduce((acc, cur) => {
    const type = typeDefs.get(queryType[cur].typeName)
    const typeDef = queryType[cur]
    const { resolve, args } = typeDef
    return {
      ...acc,
      [cur]: {
        type: new GraphQLObjectType(type),
        resolve,
        args,
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
