import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import ProjectType from 'App/Models/ProjectType'

export default class extends BaseSeeder {
  public static environment = ['development', 'test']

  public async run() {
    await ProjectType.createMany([{ name: 'skripsi' }, { name: 'proposal penelitian' }])
  }
}
