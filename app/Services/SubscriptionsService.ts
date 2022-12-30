import SubscriptionPlan from 'App/Models/SubscriptionPlan'

export default class SubscriptionsService {
  public static async getPlan(id: number): Promise<SubscriptionPlan> {
    return SubscriptionPlan.findOrFail(id)
  }

  public static async getPlanByKind(kind: string): Promise<SubscriptionPlan> {
    return SubscriptionPlan.findByOrFail('name', kind)
  }
}
