import { test } from '@japa/runner'

test.group('Users profile', () => {
  test('retrieve profile with authenticated user', async ({ client }) => {
    // for this test case, we login manually through
    // the API to simulate the real usage
    const loginResponse = await client.post('/api/users/login').json({
      uid: 'alice',
      password: 'password',
    })
    const accessToken: string = loginResponse.body().token

    const profileResponse = await client
      .get('/api/users/profile')
      .header('Authorization', `Bearer ${accessToken}`)

    profileResponse.assertBodyContains({
      username: 'alice',
      email: 'alice@email.com',
    })
  })

  test('retrieve profile with unauthenticated user', async ({ client }) => {
    const response = await client.get('/api/users/profile')

    response.assertStatus(401)
  })
})
