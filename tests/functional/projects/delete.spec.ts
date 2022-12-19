import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import ProjectType from 'App/Models/ProjectType'
import User from 'App/Models/User'

test.group('Projects delete', (group) => {
  let alice
  let skripsi
  let project

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    alice = await User.findByOrFail('username', 'alice')
    skripsi = await ProjectType.findByOrFail('name', 'skripsi')
    project = await alice.related('projects').create({
      name: 'Membangun Website dengan AdonisJS',
      projectTypeId: skripsi.id,
    })

    return () => Database.rollbackGlobalTransaction()
  })

  test('delete project', async ({ client }) => {
    const projectId = project.id

    const response = await client.delete(`/api/projects/${projectId}`).loginAs(alice)

    response.assertBodyContains({
      deleted: projectId,
    })
  })
})
