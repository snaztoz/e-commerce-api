import User from 'App/Models/User'

export default class UsersService {
  public static async getUser(name: string): Promise<User> {
    return User.findByOrFail('username', name)
  }
}
