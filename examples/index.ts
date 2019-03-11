import { type, types, run } from '@app/index'

type('User', {
  id: types.number,
  name: types.string,
})

type('Query', {
  user: 'User',
})

run()
