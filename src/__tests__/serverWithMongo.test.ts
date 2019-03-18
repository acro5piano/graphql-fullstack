import { resolve } from 'path'
import request from 'supertest'
import { server } from '@app/server'
import { setSchema, setConfig } from '@app/store'
import { gql } from '@app/__tests__/test-utils'
import graphql from 'graphql-tag'
import { buildSchema } from '@app/parser/parser'
import { init, terminate } from '@app/database/mongodb'
import { db } from '@app/database/mongodb'

const schemaStructure = graphql`
  type User {
    id: String!
    name: String
  }

  type Query {
    users: [User] @all(type: User)
  }
`

const config = {
  basePath: resolve(__dirname),
  resolvers: resolve(__dirname, 'resolvers'),
  directives: [resolve(__dirname, 'directives')],
}

describe('server', () => {
  beforeAll(async () => {
    await init()
    setConfig(config)
    const schema = await buildSchema(schemaStructure)
    setSchema(schema)
  })

  afterAll(terminate)

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

    const users = await db
      .collection('users')
      .find()
      .map(x => ({ ...x, id: String(x._id), _id: undefined }))
      .toArray()

    expect(res.body).toEqual({
      data: {
        users,
      },
    })
  })
})
