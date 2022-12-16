import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Subscription from 'App/Models/Subscription'
import SubscriptionPlan from 'App/Models/SubscriptionPlan'
import User from 'App/Models/User'

export default class Order extends BaseModel {
  /**
   * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column.dateTime()
  public paymentDate: DateTime

  @column()
  public userId: number

  @column()
  public subscriptionPlanId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relationships
   */

  @hasOne(() => Subscription)
  public subscription: HasOne<typeof Subscription>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => SubscriptionPlan)
  public plan: BelongsTo<typeof SubscriptionPlan>
}
