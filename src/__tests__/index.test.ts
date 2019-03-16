// import { GraphQLInt, GraphQLString } from 'graphql'
import * as request from 'supertest'
import { app } from '@app/server'
import { gql } from '@app/__tests__/test-utils'

describe('app', () => {
  it('can run query', async () => {
    let res = await request(app)
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
