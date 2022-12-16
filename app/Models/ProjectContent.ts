import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Project from 'App/Models/Project'
import ProjectPart from 'App/Models/ProjectPart'

export default class ProjectContent extends BaseModel {
  /**
   * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public content: string

  @column()
  public projectId: number

  @column()
  public projectPartId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @belongsTo(() => Project)
  public project: BelongsTo<typeof Project>

  @belongsTo(() => ProjectPart)
  public part: BelongsTo<typeof ProjectPart>
}
