import { test } from '@japa/runner'

test.group('Users signup', () => {
  test('users signup', async ({ client }) => {
    const response = await client.post('/api/users/signup').json({
      username: 'bob',
      email: 'bob@email.com',
      password: 'password',
      password_confirmation: 'password',
    })

    response.assertStatus(201)
  })

  test('users signup with already existing user', async ({ client }) => {
    const response = await client.post('/api/users/signup').json({
      username: 'alice',
      email: 'alice@email.com',
      password: 'password',
      password_confirmation: 'password',
    })

    response.assertStatus(400)
  })
})
