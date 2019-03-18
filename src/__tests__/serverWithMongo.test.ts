import request from 'supertest'
import { server } from '@app/server'
import { setSchema, setConfig } from '@app/store'
import { gql, testConfig } from '@app/__tests__/test-utils'
import { buildSchemaFromString } from '@app/parser/parser'
import { init, terminate } from '@app/database/mongodb'
import { db } from '@app/database/mongodb'

const schemaString = gql`
  type User {
    id: String!
    name: String
  }

  type Query {
    users: [User] @all(type: User)
  }
`

describe('server', () => {
  beforeAll(async () => {
    await init()
    setConfig(testConfig)
    const schema = await buildSchemaFromString(schemaString)
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