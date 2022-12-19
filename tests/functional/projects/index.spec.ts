import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import ProjectType from 'App/Models/ProjectType'
import User from 'App/Models/User'

test.group('Projects index', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('retrieve user projects', async ({ client }) => {
    const user = await User.findByOrFail('username', 'alice')
    const skripsi = await ProjectType.findByOrFail('name', 'skripsi')
    await user.related('projects').createMany([
      { name: 'Foo', projectTypeId: skripsi.id },
      { name: 'Bar', projectTypeId: skripsi.id },
      { name: 'Baz', projectTypeId: skripsi.id },
    ])

    const response = await client.get('/api/projects').loginAs(user)

    response.assertBodyContains({
      projects: [
        { name: 'Foo', projectType: { id: skripsi.id, name: 'skripsi' } },
        { name: 'Bar', projectType: { id: skripsi.id, name: 'skripsi' } },
        { name: 'Baz', projectType: { id: skripsi.id, name: 'skripsi' } },
      ],
    })
  })
})
