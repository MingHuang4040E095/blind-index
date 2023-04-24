import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary() // 使用者id
      table.string('name').notNullable() // 姓名
      table.string('name_blind_index').notNullable() // 姓名 盲索引
      table.string('tel') // 電話
      table.string('tel_blind_index') // 電話 盲索引
      table.string('address') // 地址
      table.string('address_blind_index') // 地址 盲索引
      table.string('email').notNullable().unique() // 信箱帳號
      table.string('password').notNullable() // 密碼

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }) // 創建日期
      table.timestamp('updated_at', { useTz: true }) // 更新日期
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
