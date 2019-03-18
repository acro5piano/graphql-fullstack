import request from 'supertest'
import { server } from '@app/server'
import { setSchema, setConfig } from '@app/store'
import { gql, testConfig } from '@app/__tests__/test-utils'
import { buildSchemaFromString } from '@app/parser/parser'

const schemaString = gql`
  type User {
    id: Int!
    name: String!
  }

  type Query {
    hello: String @field(resolver: "hello")
    user: User @field(resolver: "user")
    users: [User] @field(resolver: "users")
  }
`

describe('server', () => {
  beforeAll(async () => {
    setConfig(testConfig)
    const schema = await buildSchemaFromString(schemaString)
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
  it('can run users query', async () => {
    const res = await request(server)
      .post('/graphql')
      .send({
        query: gql`
          query GetUsers {
            users {
              id
              name
            }
          }
        `,
      })
      .expect(200)
    expect(res.body).toEqual({
      data: {
        users: [
          {
            id: 1,
            name: 'Kazuya',
          },
        ],
      },
    })
  })
})
