import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import ProjectPart from 'App/Models/ProjectPart'
import ProjectType from 'App/Models/ProjectType'
import User from 'App/Models/User'

test.group('Users active subscription', (group) => {
  let alice: User
  let skripsi: ProjectType
  let skripsiParts: ProjectPart[]

  group.setup(async () => {
    alice = await User.findByOrFail('username', 'alice')
    skripsi = await ProjectType.findByOrFail('name', 'skripsi')
    skripsiParts = await skripsi.related('parts').query()
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('contents after create project', async ({ assert }) => {
    const project = await alice.related('projects').create({
      name: 'Skripsi Alice',
      projectTypeId: skripsi.id,
    })

    const parts = await project.related('contents').query()

    assert.equal(parts.length, skripsiParts.length)
    assert.isTrue(parts.every((p) => p.content === ''))
  })
})
