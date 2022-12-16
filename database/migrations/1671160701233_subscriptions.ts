import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'subscriptions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.dateTime('end_date')
      table.integer('user_id').unsigned().notNullable()
      table.integer('subscription_plan_id').unsigned().notNullable()
      table.integer('order_id').unsigned()

      table.foreign('user_id').references('users.id')
      table.foreign('subscription_plan_id').references('subscription_plans.id')
      table.foreign('order_id').references('orders.id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).defaultTo(this.now())
      table.timestamp('updated_at', { useTz: true }).defaultTo(this.now())
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
