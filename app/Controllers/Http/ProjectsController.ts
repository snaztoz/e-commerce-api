import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ProjectType from 'App/Models/ProjectType'

export default class ProjectsController {
  public async index({ response }: HttpContextContract) {
    return response.notImplemented()
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!
    const newProjectSchema = schema.create({
      projectTypeId: schema.number([rules.exists({ table: 'project_types', column: 'id' })]),
    })

    let payload
    try {
      payload = await request.validate({ schema: newProjectSchema })
    } catch (err) {
      return response.badRequest(err)
    }

    await user.related('projects').create({
      projectTypeId: payload.projectTypeId,
    })

    return response.created()
  }

  public async show({ response }: HttpContextContract) {
    return response.notImplemented()
  }

  public async destroy({ response }: HttpContextContract) {
    return response.notImplemented()
  }

  public async types({}: HttpContextContract) {
    const projectTypes = await ProjectType.all()
    return {
      types: projectTypes.map((t) =>
        t.serialize({
          fields: {
            pick: ['id', 'name'],
          },
        })
      ),
    }
  }
}
