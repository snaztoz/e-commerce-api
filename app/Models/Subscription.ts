import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import Order from 'App/Models/Order'
import SubscriptionPlan from 'App/Models/SubscriptionPlan'
import User from 'App/Models/User'

export default class Subscription extends BaseModel {
  /**
   * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public subscriptionPlanId: number

  @column()
  public orderId: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @belongsTo(() => User)
  public subscriber: BelongsTo<typeof User>

  @belongsTo(() => SubscriptionPlan)
  public plan: BelongsTo<typeof SubscriptionPlan>

  @belongsTo(() => Order)
  public order: BelongsTo<typeof Order>
}
