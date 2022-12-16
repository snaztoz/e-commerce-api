import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import User from 'App/Models/User'

export default class extends BaseSeeder {
  public static environment = ['development', 'test']

  public async run() {
    await User.create({
      email: 'alice@email.com',
      username: 'alice',
      password: 'password',
    })
  }
}
