import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import SubscriptionPlan from 'App/Models/SubscriptionPlan'
import SubscriptionsService from 'App/Services/SubscriptionsService'

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

  public async makeOrder({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!

    const makeOrderSchema = schema.create({
      planId: schema.number([rules.exists({ table: 'subscription_plans', column: 'id' })]),
    })

    let payload
    try {
      payload = await request.validate({ schema: makeOrderSchema })
    } catch (err) {
      return response.badRequest(err)
    }

    const plan = await SubscriptionsService.getPlan(payload.planId)
    const order = await SubscriptionsService.makeOrder(user, plan)

    response.created()
    return { id: order.id }
  }
}
