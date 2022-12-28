import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'

import User from 'App/Models/User'
import Project from 'App/Models/Project'

export default class ProjectsPolicy extends BasePolicy {
  public async view(user: User, project: Project) {}

  public async delete(user: User, project: Project) {
    return user.id === project.userId
  }
}
