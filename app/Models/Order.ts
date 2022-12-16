import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import SubscriptionPlan from 'App/Models/SubscriptionPlan'
import User from 'App/Models/User'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public paymentDate: Date

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => SubscriptionPlan)
  public plan: BelongsTo<typeof SubscriptionPlan>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
