// import { GraphQLInt, GraphQLString } from 'graphql'
import * as request from 'supertest'
import { server } from '@app/server'
import { setSchema } from '@app/store'
import { gql } from '@app/__tests__/test-utils'
import graphql from 'graphql-tag'
import { buildSchema } from '@app/parser'

const schemaStructure = graphql`
  type Query {
    hello: String @resolver(path: "./__tests__/resolver/helloResolver")
  }
`

describe('server', () => {
  beforeAll(async () => {
    const schema = await buildSchema(schemaStructure)
    setSchema(schema)
  })
  it('can run query', async () => {
    let res = await request(server)
      .post('/graphql')
      .send({
        query: gql`
          query Hello {
            hello
          }
        `,
      })
      .expect(200)
    expect(res.body).toEqual({
      data: {
        hello: 'world',
      },
    })
  })
})
