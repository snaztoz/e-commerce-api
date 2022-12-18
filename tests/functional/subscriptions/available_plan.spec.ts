import { test } from '@japa/runner'

test.group('Subscriptions available plans', () => {
  test('get all available plans', async ({ client }) => {
    const response = await client.get('/api/subscriptions/available-plans')

    response.assertBodyContains({
      availablePlans: [
        { id: 1, name: 'free', pricing: 0 },
        { id: 2, name: 'personal', pricing: 30000 },
        { id: 3, name: 'pro', pricing: 50000 },
      ],
    })
  })
})
