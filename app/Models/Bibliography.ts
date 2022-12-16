import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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
}
