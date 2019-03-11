export { type } from '@app/type'
export { types } from '@app/types'
import { app } from '@app/server'

export async function run() {
  app.listen(5252, () => {
    console.log('running on http://localhost:5252')
  })
}
