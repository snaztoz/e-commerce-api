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
        { id: 1, name: 'Foo' },
        { id: 2, name: 'Bar' },
        { id: 3, name: 'Baz' },
      ],
    })
  })
})
