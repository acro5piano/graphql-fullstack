import request from 'supertest'
import { server } from '@app/server'
import { setSchema, setConfig } from '@app/store'
import { gql, testConfig } from '@app/__tests__/test-utils'
import { buildSchemaFromString } from '@app/parser/parser'
import { init, terminate } from '@app/database/mongodb'
import { db, changeDBToRandomName } from '@app/database/mongodb'
import { mapId } from '@app/database/utils'

const schemaString = gql`
  type User {
    id: String!
    name: String
  }

  input UserInput {
    name: String!
  }

  type Query {
    users: [User] @all(type: User)
  }

  type Mutation {
    createUser(input: UserInput!): User @create(type: User)
  }
`

describe('server', () => {
  beforeAll(async () => {
    await init()
    setConfig(testConfig)
    const schema = await buildSchemaFromString(schemaString)
    setSchema(schema)

    await changeDBToRandomName()
  })

  afterAll(terminate)

  it('can mutate', async () => {
    const res = await request(server)
      .post('/graphql')
      .send({
        query: gql`
          mutation CreateUser($input: UserInput!) {
            createUser(input: $input) {
              id
              name
            }
          }
        `,
        variables: {
          input: {
            name: 'Kazuya',
          },
        },
      })
      .expect(200)

    const user = await db.collection('users').findOne({})
    user.id = String(user._id)
    delete user['_id']

    expect(res.body).toEqual({
      data: {
        createUser: user,
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

    const users = await db
      .collection('users')
      .find()
      .map(mapId)
      .toArray()

    expect(res.body).toEqual({
      data: {
        users,
      },
    })
  })
})
