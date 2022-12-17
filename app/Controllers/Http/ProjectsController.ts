import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import ProjectType from 'App/Models/ProjectType'

export default class ProjectsController {
  public async index({ response }: HttpContextContract) {
    return response.notImplemented()
  }

  public async store({ response }: HttpContextContract) {
    return response.notImplemented()
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
