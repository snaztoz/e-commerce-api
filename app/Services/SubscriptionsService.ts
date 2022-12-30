import SubscriptionPlan from 'App/Models/SubscriptionPlan'

export default class SubscriptionsService {
  public static async getPlan(kind: string): Promise<SubscriptionPlan> {
    return SubscriptionPlan.findByOrFail('name', kind)
  }
}
