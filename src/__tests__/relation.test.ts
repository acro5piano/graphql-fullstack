import request from 'supertest'
import { server } from '@app/server'
import { setSchema, setConfig } from '@app/store'
import { gql, testConfig } from '@app/__tests__/test-utils'
import { buildSchemaFromString } from '@app/parser/parser'
import { init, terminate } from '@app/database/mongodb'
import { db, changeDBToRandomName } from '@app/database/mongodb'
import { mapId } from '@app/database/utils'

const schemaString = gql`
  type Post {
    id: String!
    title: String
  }

  type User {
    id: String!
    name: String
    posts: [Post]
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

    await changeDBToRandomName()
  })

  afterAll(terminate)

  it('can query ralation field', async () => {
    db.collection('users').insertOne({
      name: 'Kazuya',
      posts: [
        {
          title: 'a post',
        },
      ],
    })
    const res = await request(server)
      .post('/graphql')
      .send({
        query: gql`
          query GetUsers {
            users {
              id
              name
              posts {
                title
              }
            }
          }
        `,
      })
      .expect(200)

    const users = await db
      .collection('users')
      .find({})
      .map(mapId)
      .toArray()

    expect(res.body).toEqual({
      data: {
        users,
      },
    })
  })
})
