import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import SubscriptionPlan from 'App/Models/SubscriptionPlan'

export default class SubscriptionsController {
  public async availablePlans({}: HttpContextContract) {
    const plans = await SubscriptionPlan.all()
    const availablePlans = plans
      .map((p) =>
        p.serialize({
          fields: {
            pick: ['id', 'name', 'pricing'],
          },
        })
      )
      .map((p) => ({
        ...p,
        // by default, pricing is in string type, so we
        // must cast it manually
        pricing: Number(p.pricing),
      }))

    return { availablePlans }
  }
}
