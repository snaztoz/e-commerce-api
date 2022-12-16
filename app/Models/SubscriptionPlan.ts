import { DateTime } from 'luxon'
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'

import Order from 'App/Models/Order'
import Subscription from 'App/Models/Subscription'

export default class SubscriptionPlan extends BaseModel {
  /**
   * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @hasMany(() => Order)
  public orders: HasMany<typeof Order>

  @hasMany(() => Subscription)
  public subscriptions: HasMany<typeof Subscription>
}
