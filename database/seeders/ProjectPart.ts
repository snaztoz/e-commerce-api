import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

import ProjectType from 'App/Models/ProjectType'

export default class extends BaseSeeder {
  public async run() {
    const skripsi = await ProjectType.findByOrFail('name', 'skripsi')
    const proposal = await ProjectType.findByOrFail('name', 'proposal penelitian')

    await Promise.all([
      skripsi.related('parts').createMany([
        {
          ordering: 0,
          name: 'Bab 1 Pendahuluan',
        },
        {
          ordering: 1,
          name: 'Bab 2 Landasan Teori',
        },
      ]),
      proposal.related('parts').createMany([
        {
          ordering: 0,
          name: 'Bab 1 Pendahuluan',
        },
        {
          ordering: 1,
          name: 'Bab 2 Tempat dan Waktu',
        },
      ]),
    ])
  }
}
