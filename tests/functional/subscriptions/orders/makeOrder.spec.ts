import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

import SubscriptionPlan from 'App/Models/SubscriptionPlan'
import SubscriptionsService from 'App/Services/SubscriptionsService'
import User from 'App/Models/User'
import UsersService from 'App/Services/UsersService'

test.group('Subscription orders making', (group) => {
  let alice: User
  let personalPlan: SubscriptionPlan

  group.setup(async () => {
    alice = await UsersService.getUser('alice')
    personalPlan = await SubscriptionsService.getPlanByKind('personal')
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('authenticated user make subscription order', async ({ assert, client }) => {
    const response = await client
      .post('/api/subscriptions/orders')
      .json({
        planId: personalPlan.id,
      })
      .loginAs(alice)

    response.assertStatus(201)
    assert.exists(response.body().token)
    assert.exists(response.body().redirect_url)

    const activeSubscription = await alice.getActiveSubscription()
    assert.equal(activeSubscription.subscriptionPlanId, personalPlan.id)
  })

  test('unauthenticated user make subscription order', async ({ client }) => {
    const response = await client.post('/api/subscriptions/orders').json({
      planId: personalPlan.id,
    })

    response.assertStatus(401)
  })
})
