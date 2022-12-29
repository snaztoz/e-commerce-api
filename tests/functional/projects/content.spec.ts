import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import Project from 'App/Models/Project'
import ProjectPart from 'App/Models/ProjectPart'
import ProjectType from 'App/Models/ProjectType'
import User from 'App/Models/User'

test.group('Project content', (group) => {
  let alice: User
  let project: Project
  let skripsi: ProjectType
  let skripsiParts: ProjectPart[]

  group.setup(async () => {
    alice = await User.findByOrFail('username', 'alice')
    skripsi = await ProjectType.findByOrFail('name', 'skripsi')
    skripsiParts = await skripsi.related('parts').query()
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    project = await alice.related('projects').create({
      name: 'Skripsi Alice',
      projectTypeId: skripsi.id,
    })

    return () => Database.rollbackGlobalTransaction()
  })

  test('show project content by authenticated user', async ({ client }) => {
    const NEW_CONTENT = 'Konten baru untuk skripsi'
    const firstPart = skripsiParts[0]
    const firstPartContent = await project
      .related('contents')
      .query()
      .where('projectPartId', `${firstPart.id}`)
      .firstOrFail()

    // update the content first
    firstPartContent.content = NEW_CONTENT
    await firstPartContent.save()

    const response = await client
      .get(`/api/projects/${project.id}/parts/${firstPart.id}/content`)
      .loginAs(alice)

    response.assertBodyContains({
      id: firstPartContent.id,
      content: NEW_CONTENT,
    })
  })

  test('update project content by authenticated user', async ({ assert, client }) => {
    const NEW_CONTENT = 'A new content'
    const firstPart = skripsiParts[0]

    const response = await client
      .put(`/api/projects/${project.id}/parts/${firstPart.id}/content`)
      .json({
        content: NEW_CONTENT,
      })
      .loginAs(alice)

    response.assertStatus(200)

    const firstPartContent = await project
      .related('contents')
      .query()
      .where('projectPartId', `${firstPart.id}`)
      .firstOrFail()

    assert.equal(firstPartContent.content, NEW_CONTENT)
  })

  test('show project content by unauthenticated user', async ({ client }) => {
    const firstPart = skripsiParts[0]

    const response = await client.get(`/api/projects/${project.id}/parts/${firstPart.id}/content`)

    response.assertStatus(401)
  })

  test('update project content by unauthenticated user', async ({ client }) => {
    const firstPart = skripsiParts[0]

    const response = await client
      .get(`/api/projects/${project.id}/parts/${firstPart.id}/content`)
      .json({
        content: 'A new content sent by an anonymous user',
      })

    response.assertStatus(401)
  })
})
