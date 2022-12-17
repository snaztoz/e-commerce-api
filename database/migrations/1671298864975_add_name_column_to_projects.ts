import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'projects'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('name').notNullable().defaultTo('')
    })
  }
}
