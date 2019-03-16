// import { GraphQLInt, GraphQLString } from 'graphql'
import * as request from 'supertest'
import { server } from '@app/server'
import { gql } from '@app/__tests__/test-utils'

describe('server', () => {
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
