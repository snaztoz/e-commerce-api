import { test } from '@japa/runner'

import ProjectType from 'App/Models/ProjectType'
import User from 'App/Models/User'

test.group('Projects store', () => {
  test('store new project', async ({ client }) => {
    const user = await User.findByOrFail('username', 'alice')
    const skripsi = await ProjectType.findByOrFail('name', 'skripsi')

    const response = await client
      .post('/api/projects')
      .json({
        name: 'Membuat Website dengan AdonisJS',
        projectTypeId: skripsi.id,
      })
      .loginAs(user)

    response.assertStatus(201)
  })
})
