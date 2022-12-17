import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import ProjectContent from 'App/Models/ProjectContent'
import ProjectType from 'App/Models/ProjectType'
import User from 'App/Models/User'

export default class Project extends BaseModel {
  /**
   * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public userId: number

  @column()
  public projectTypeId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @belongsTo(() => User)
  public author: BelongsTo<typeof User>

  @belongsTo(() => ProjectType)
  public projectType: BelongsTo<typeof ProjectType>

  @hasMany(() => ProjectContent)
  public contents: HasMany<typeof ProjectContent>
}
