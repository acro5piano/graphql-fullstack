import { resolve } from 'path'
import request from 'supertest'
import { server } from '@app/server'
import { setSchema, setConfig } from '@app/store'
import { gql } from '@app/__tests__/test-utils'
import graphql from 'graphql-tag'
import { buildSchema } from '@app/parser'

const schemaStructure = graphql`
  type User {
    id: Int!
    name: String!
  }

  type Query {
    hello: String @field(resolver: "hello")
    user: User @field(resolver: "user")
  }
`

const config = {
  basePath: resolve(__dirname),
  resolvers: resolve(__dirname, 'resolvers'),
  directives: [resolve(__dirname, 'directives')],
}

describe('server', () => {
  beforeAll(async () => {
    setConfig(config)
    const schema = await buildSchema(schemaStructure)
    setSchema(schema)
  })
  it('can run hello query', async () => {
    const res = await request(server)
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
  it('can run user query', async () => {
    const res = await request(server)
      .post('/graphql')
      .send({
        query: gql`
          query GetUser {
            user {
              id
              name
            }
          }
        `,
      })
      .expect(200)
    expect(res.body).toEqual({
      data: {
        user: {
          id: 1,
          name: 'Kazuya',
        },
      },
    })
  })
})
