import { bind } from '@adonisjs/route-model-binding'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Project from 'App/Models/Project'
import ProjectType from 'App/Models/ProjectType'

export default class ProjectsController {
  public async index({ auth }: HttpContextContract) {
    const user = auth.use('api').user!
    const projects = await user.related('projects').query().preload('projectType')
    const serializedProjects = projects.map((p) =>
      p.serialize({
        fields: {
          pick: ['id', 'name', 'createdAt', 'updatedAt'],
        },
        relations: {
          projectType: {
            fields: ['id', 'name'],
          },
        },
      })
    )

    return {
      projects: serializedProjects,
    }
  }

  public async store({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!
    const newProjectSchema = schema.create({
      name: schema.string(),
      projectTypeId: schema.number([rules.exists({ table: 'project_types', column: 'id' })]),
    })

    let payload
    try {
      payload = await request.validate({ schema: newProjectSchema })
    } catch (err) {
      return response.badRequest(err)
    }

    await user.related('projects').create(payload)

    return response.created()
  }

  @bind()
  public async show({ bouncer }: HttpContextContract, project: Project) {
    await bouncer.with('ProjectsPolicy').authorize('view', project)

    const projectType = await project.related('projectType').query().firstOrFail()
    const projectParts = await projectType.related('parts').query()

    return {
      ...project.serialize({ fields: { pick: ['id', 'name'] } }),
      projectType: {
        ...projectType.serialize({ fields: { pick: ['id', 'name'] } }),
      },
      projectParts: await Promise.all(
        projectParts.map(async (part) => {
          const content = await part
            .related('contents')
            .query()
            .where('projectId', `${project.id}`)
            .firstOrFail()

          return {
            ...part.serialize({ fields: { pick: ['id', 'name'] } }),
            content: {
              id: content.id,
              value: content.content,
            },
          }
        })
      ),
    }
  }

  @bind()
  public async destroy({ bouncer }: HttpContextContract, project: Project) {
    await bouncer.with('ProjectsPolicy').authorize('delete', project)

    await project.delete()

    return {
      deleted: Number(project.id),
    }
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
