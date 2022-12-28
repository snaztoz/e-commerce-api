import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'project_contents'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('project_id')
      table.foreign('project_id').references('projects.id').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('project_id')
      table.foreign('project_id').references('projects.id').onDelete('RESTRICT')
    })
  }
}
