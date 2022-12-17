import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, HasMany, afterCreate, beforeSave, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'

import Order from 'App/Models/Order'
import Project from 'App/Models/Project'
import Subscription from 'App/Models/Subscription'
import SubscriptionPlan from 'App/Models/SubscriptionPlan'

export default class User extends BaseModel {
  /**
   * Columns
   */

  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Extra members
   */

  public async getActiveSubscription(): Promise<Subscription> {
    const user: User = this
    const subscriptions = await user.related('subscriptions').query().orderBy('end_date', 'desc')
    const latestSubscription = subscriptions[0]

    if (latestSubscription.endDate >= DateTime.now()) {
      // if the latest subscription's end date is
      // still in the future
      return latestSubscription
    }

    // or else set back to default free subscription
    // plan
    return subscriptions.find((s) => !s.endDate)!
  }

  /**
   * Relationships
   */

  @hasMany(() => Order)
  public orders: HasMany<typeof Order>

  @hasMany(() => Subscription)
  public subscriptions: HasMany<typeof Subscription>

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>

  /**
   * Hooks
   */

  @afterCreate()
  public static async addFreeSubscription(user: User) {
    const freePlan = await SubscriptionPlan.findByOrFail('name', 'free')

    await user.related('subscriptions').create({
      subscriptionPlanId: freePlan.id,
    })
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
