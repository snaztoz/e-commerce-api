import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import ProjectType from 'App/Models/ProjectType'
import User from 'App/Models/User'

test.group('Projects delete', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('delete project', async ({ client }) => {
    const alice = await User.findByOrFail('username', 'alice')
    const skripsi = await ProjectType.findByOrFail('name', 'skripsi')
    const project = await alice.related('projects').create({
      name: 'Membangun Website dengan AdonisJS',
      projectTypeId: skripsi.id,
    })
    const projectId = project.id

    const response = await client.delete(`/api/projects/${projectId}`).loginAs(alice)

    response.assertBodyContains({
      deleted: projectId,
    })
  })
})
