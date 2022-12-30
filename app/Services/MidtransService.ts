import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import { MidtransClient } from 'midtrans-node-client'

const client = new MidtransClient.Snap({
  isProduction: Application.inProduction,
  serverKey: Env.get('MIDTRANS_SERVER_KEY'),
  clientKey: Env.get('MIDTRANS_CLIENT_KEY'),
})

export default class MidtransService {
  public static async newOrder(id: number, amount: number): Promise<TransactionResponse> {
    const payment = await client.createTransaction({
      transaction_details: {
        order_id: `SUBSCRIPTION-${id}`,
        gross_amount: amount,
      },
      credit_card: {
        secure: true,
      },
    })

    return payment as TransactionResponse
  }
}

export interface TransactionResponse {
  token: string
  redirect_url: string
}
