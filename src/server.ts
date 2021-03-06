import express from 'express'
import bodyParser from 'body-parser'
import { graphql } from 'graphql'
import { getSchema } from '@app/store'

export const server = express()

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(require('cors')())

server.post('/graphql', (req, res) => {
  graphql(getSchema(), req.body.query, undefined, undefined, req.body.variables)
    .then(result => {
      res.send(result)
    })
    .catch(err => {
      res.send(err)
    })
})

export async function runserver() {
  server.listen(5252, () => {
    console.log('running on http://localhost:5252')
  })
}
