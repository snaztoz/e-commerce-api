import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import ProjectType from 'App/Models/ProjectType'

test.group('Project types', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('get project types', async ({ client }) => {
    await ProjectType.createMany([{ name: 'skripsi' }, { name: 'proposal penelitian' }])

    const response = await client.get('/api/projects/types')

    response.assertBodyContains({
      types: [{ name: 'skripsi' }, { name: 'proposal penelitian' }],
    })
  })
})
