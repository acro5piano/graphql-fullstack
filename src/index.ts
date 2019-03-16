// export { type } from '@app/type'
// export { types } from '@app/types'
// export * from '@app/withResolver'

import { server } from '@app/server'

export async function run() {
  server.listen(5252, () => {
    console.log('running on http://localhost:5252')
  })
}
