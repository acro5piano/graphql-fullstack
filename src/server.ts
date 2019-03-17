import * as express from 'express'
import * as bodyParser from 'body-parser'
import { graphql } from 'graphql'
// import { typeDefs } from '@app/store'
import { getSchema } from '@app/store'

export const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(require('cors')())

server.post('/graphql', (req, res) => {
  graphql(getSchema(), req.body.query).then(result => {
    res.send(result)
  })
})
