import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import Project from 'App/Models/Project'
import ProjectPart from 'App/Models/ProjectPart'
import ProjectType from 'App/Models/ProjectType'
import User from 'App/Models/User'

test.group('Project show', (group) => {
  let alice: User
  let skripsi: ProjectType
  let skripsiParts: ProjectPart[]
  let project: Project

  group.setup(async () => {
    alice = await User.findByOrFail('username', 'alice')
    skripsi = await ProjectType.findByOrFail('name', 'skripsi')
    skripsiParts = await skripsi.related('parts').query()
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    project = await alice.related('projects').create({
      name: 'Penanaman Pohon Pisang tanpa Tanah',
      projectTypeId: skripsi.id,
    })

    return () => Database.rollbackGlobalTransaction()
  })

  test('get project by authenticated user', async ({ client }) => {
    const response = await client.get(`/api/v1/projects/${project.id}`).loginAs(alice)

    response.assertStatus(200)
    response.assertBodyContains({
      id: project.id,
      name: project.name,
      projectType: {
        id: skripsi.id,
        name: skripsi.name,
      },
      projectParts: await Promise.all(
        skripsiParts.map(async (p) => {
          const content = await p
            .related('contents')
            .query()
            .where('projectId', `${project.id}`)
            .firstOrFail()

          return {
            id: p.id,
            name: p.name,
            content: {
              id: content.id,
              value: content.content,
            },
          }
        })
      ),
    })
  })

  test('get project by unauthenticated user', async ({ client }) => {
    const response = await client.get(`/api/v1/projects/${project.id}`)

    response.assertStatus(403)
  })
})
