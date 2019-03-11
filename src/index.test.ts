import { GraphQLInt, GraphQLString } from 'graphql'
import * as request from 'supertest'
import { type, withResolver, withArgs, decorate } from '@app/index'
import { app } from '@app/server'
import { gql } from '@app/test-utils'

const userResolver = withResolver((_root, { id }) => ({ id, name: 'kazuya' }))
const userArgs = withArgs({
  id: {
    type: GraphQLInt,
  },
})

type('User', {
  id: GraphQLInt,
  name: GraphQLString,
})

type('Query', {
  user: decorate('User', userResolver, userArgs),
})

describe('app', () => {
  it('can run query', async () => {
    let res = await request(app)
      .post('/graphql')
      .send({
        query: gql`
          query GetUser {
            user(id: 1) {
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
          name: 'kazuya',
        },
      },
    })
  })
})
