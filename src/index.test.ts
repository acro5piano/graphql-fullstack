import { type, types } from '@app/index'
import { app } from '@app/server'
import * as request from 'supertest'

type('User', {
  id: types.number,
  name: types.string,
})

type('Query', {
  user: 'User',
})

function gql(literals: TemplateStringsArray) {
  return literals[0]
}

describe('app', () => {
  it('can run query', async () => {
    await request(app)
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
  })
})
