// import { GraphQLInt, GraphQLString } from 'graphql'
import * as request from 'supertest'
import { server } from '@app/server'
import { setSchema, setConfig } from '@app/store'
import { gql } from '@app/__tests__/test-utils'
import graphql from 'graphql-tag'
import { buildSchema } from '@app/parser'
import * as path from 'path'

const schemaStructure = graphql`
  type Query {
    id: Int @resolver(path: "idResolver")
    hello: String @resolver(path: "helloResolver")
  }
`

const config = {
  basePath: path.resolve(__dirname),
}

describe('server', () => {
  beforeAll(async () => {
    setConfig(config)
    const schema = await buildSchema(schemaStructure)
    setSchema(schema)
  })
  it('can run query', async () => {
    let res = await request(server)
      .post('/graphql')
      .send({
        query: gql`
          query Hello {
            id
            hello
          }
        `,
      })
      .expect(200)
    expect(res.body).toEqual({
      data: {
        id: 1,
        hello: 'world',
      },
    })
  })
})
