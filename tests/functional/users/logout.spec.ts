import { test } from '@japa/runner'

import User from 'App/Models/User'

test.group('Users logout', () => {
  test('logout user', async ({ client }) => {
    const alice = await User.findByOrFail('username', 'alice')

    const response = await client.post('/api/users/logout').loginAs(alice)

    response.assertBodyContains({
      revoked: true,
    })
  })

  test('logout unauthenticated user', async ({ client }) => {
    const response = await client.post('/api/users/logout')

    response.assertStatus(401)
  })
})
