import { DateTime } from 'luxon'

import MidtransService, {
  TransactionResponse as MidtransTransactionResponse,
} from './MidtransService'
import SubscriptionPlan from 'App/Models/SubscriptionPlan'
import User from 'App/Models/User'

export default class SubscriptionsService {
  public static async getPlan(id: number): Promise<SubscriptionPlan> {
    return SubscriptionPlan.findOrFail(id)
  }

  public static async getPlanByKind(kind: string): Promise<SubscriptionPlan> {
    return SubscriptionPlan.findByOrFail('name', kind)
  }

  public static async makeOrder(
    user: User,
    plan: SubscriptionPlan
  ): Promise<MidtransTransactionResponse> {
    const order = await user.related('orders').create({
      subscriptionPlanId: plan.id,
      // TODO: should be set based on Midtrans notification instead
      paymentDate: DateTime.now(),
    })

    return MidtransService.newOrder(order.id, plan.price)
  }
}
