import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'
import { test } from '@japa/runner'

import SubscriptionPlan from 'App/Models/SubscriptionPlan'
import User from 'App/Models/User'

test.group('Users active subscription', (group) => {
  let alice: User
  let personalPlan: SubscriptionPlan
  let proPlan: SubscriptionPlan

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    alice = await User.findByOrFail('username', 'alice')
    personalPlan = await SubscriptionPlan.findByOrFail('name', 'personal')
    proPlan = await SubscriptionPlan.findByOrFail('name', 'pro')

    return () => Database.rollbackGlobalTransaction()
  })

  test('user with no paid subscription', async ({ assert }) => {
    const subscription = await alice.getActiveSubscription()
    const planName = await subscription.getPlanName()

    assert.equal(planName, 'free')
  })

  test('user with paid subscription', async ({ assert }) => {
    await alice.related('subscriptions').createMany([
      {
        // another subscription but is already expired
        endDate: DateTime.now().minus({ months: 2 }),
        subscriptionPlanId: personalPlan.id,
      },
      {
        // set endDate to next month
        endDate: DateTime.now().plus({ months: 1 }),
        subscriptionPlanId: proPlan.id,
      },
    ])

    const subscription = await alice.getActiveSubscription()
    const planName = await subscription.getPlanName()

    assert.equal(planName, 'pro')
  })

  test('user with expired paid subscription', async ({ assert }) => {
    await alice.related('subscriptions').create({
      // set endDate to previous month
      endDate: DateTime.now().minus({ months: 1 }),
      subscriptionPlanId: proPlan.id,
    })

    const subscription = await alice.getActiveSubscription()
    const planName = await subscription.getPlanName()

    assert.equal(planName, 'free')
  })
})
