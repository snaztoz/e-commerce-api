import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import ProjectType from 'App/Models/ProjectType'

export default class ProjectPart extends BaseModel {
  /**
   * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public projectTypeId: number

  @column()
  public ordering: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @belongsTo(() => ProjectType)
  public projectType: BelongsTo<typeof ProjectType>
}
