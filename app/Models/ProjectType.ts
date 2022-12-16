import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Project from 'App/Models/Project'
import ProjectPart from 'App/Models/ProjectPart'

export default class ProjectType extends BaseModel {
  /**
   * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>

  @hasMany(() => ProjectPart)
  public parts: HasMany<typeof ProjectPart>
}
