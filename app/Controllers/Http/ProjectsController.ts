import { bind } from '@adonisjs/route-model-binding'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { string as str } from '@ioc:Adonis/Core/Helpers'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Project from 'App/Models/Project'
import ProjectPart from 'App/Models/ProjectPart'
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
            contentExcerpt: str.excerpt(content.content, 110),
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

  @bind()
  public async showContent({ bouncer }: HttpContextContract, project: Project, part: ProjectPart) {
    await bouncer.with('ProjectsPolicy').authorize('view', project)

    const content = await project
      .related('contents')
      .query()
      .where('projectPartId', `${part.id}`)
      .firstOrFail()

    return content.serialize({
      fields: {
        pick: ['id', 'content'],
      },
    })
  }

  @bind()
  public async updateContent(
    { bouncer, request, response }: HttpContextContract,
    project: Project,
    part: ProjectPart
  ) {
    await bouncer.with('ProjectsPolicy').authorize('update', project)

    const updateContentSchema = schema.create({
      content: schema.string(),
    })

    let payload
    try {
      payload = await request.validate({ schema: updateContentSchema })
    } catch (err) {
      return response.badRequest(err)
    }

    const content = await project
      .related('contents')
      .query()
      .where('projectPartId', `${part.id}`)
      .firstOrFail()

    content.content = payload.content
    await content.save()
  }
}
