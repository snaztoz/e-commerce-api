import { rules, schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import MidtransService from 'App/Services/MidtransService'
import SubscriptionPlan from 'App/Models/SubscriptionPlan'
import SubscriptionsService from 'App/Services/SubscriptionsService'
import Order from 'App/Models/Order'
import { DateTime } from 'luxon'

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
    const payment = await SubscriptionsService.makeOrder(user, plan)

    return response.created(payment)
  }

  public async midtransPaymentNotification({ request, response }: HttpContextContract) {
    let orderId: number
    let paymentDate: DateTime

    try {
      const midtransData = await MidtransService.handleNotification(request.body())
      orderId = midtransData.orderId
      paymentDate = midtransData.paymentDate
    } catch (err) {
      return response.badRequest(err)
    }

    const order = await Order.findOrFail(orderId)
    order.paymentDate = paymentDate
    order.save()
  }
}
