import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Phrase from 'App/Models/Phrase'

export default class Bibliography extends BaseModel {
  /**
   * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column.dateTime()
  public date: DateTime

  @column()
  public doi: string

  @column()
  public kind: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @hasMany(() => Phrase)
  public phrases: HasMany<typeof Phrase>
}
