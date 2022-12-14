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
}
