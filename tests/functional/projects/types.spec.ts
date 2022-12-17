import { test } from '@japa/runner'

test.group('Project types', () => {
  test('get project types', async ({ client }) => {
    const response = await client.get('/api/projects/types')

    response.assertBodyContains({
      types: [{ name: 'skripsi' }, { name: 'proposal penelitian' }],
    })
  })
})
