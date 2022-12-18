import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'

import User from 'App/Models/User'

export default class UsersController {
  public async signup({ auth, request, response }: HttpContextContract) {
    const signupSchema = schema.create({
      email: schema.string([rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      username: schema.string([rules.unique({ table: 'users', column: 'username' })]),
      password: schema.string([rules.confirmed()]),
    })

    let payload
    try {
      payload = await request.validate({
        schema: signupSchema,
      })
    } catch (err) {
      response.badRequest(err)
      return
    }

    const user = await User.create(payload)
    const token = await auth.use('api').generate(user)

    response.created()
    return token
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const loginSchema = schema.create({
      uid: schema.string(),
      password: schema.string(),
    })

    let payload
    try {
      payload = await request.validate({
        schema: loginSchema,
      })
    } catch (err) {
      response.badRequest(err)
      return
    }

    try {
      const token = await auth.use('api').attempt(payload.uid, payload.password)
      return token
    } catch {
      return response.unauthorized('Invalid credentials')
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use('api').revoke()

    return {
      revoked: true,
    }
  }

  public async profile({ auth }: HttpContextContract) {
    const user = auth.use('api').user!
    const subscription = await user.getActiveSubscription()
    const planName = await subscription.getPlanName()

    return {
      ...user.serialize(),
      activeSubscription: {
        endDate: subscription.endDate,
        plan: planName,
      },
    }
  }
}
