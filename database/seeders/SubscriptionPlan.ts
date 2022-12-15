import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import SubscriptionPlan from 'App/Models/SubscriptionPlan'

export default class extends BaseSeeder {
  public async run() {
    await SubscriptionPlan.createMany([
      {
        name: 'free',
        price: 0,
      },
      {
        name: 'personal',
        price: 30000,
      },
      {
        name: 'pro',
        price: 50000,
      },
    ])
  }
}
