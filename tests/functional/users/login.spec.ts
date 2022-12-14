import { test } from '@japa/runner'

test.group('Users login', () => {
  test('user login', async ({ client }) => {
    const response = await client.post('/api/users/login').json({
      uid: 'alice',
      password: 'password',
    })

    response.assertStatus(200)
    console.log(response.body())
  })

  test('user login with invalid credential', async ({ client }) => {
    const response = await client.post('/api/users/login').json({
      uid: 'alice',
      password: 'wrong-password',
    })

    response.assertStatus(401)
  })
})
