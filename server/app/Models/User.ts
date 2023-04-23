import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'

export default class User extends BaseModel {
  // 使用者id
  @column({ isPrimary: true })
  public id: number

  // 姓名
  @column()
  public name: string

  // 電話
  @column()
  public tel: string

  // 地址
  @column()
  public address: string

  // 信箱帳號
  @column()
  public email: string

  // 密碼
  @column({ serializeAs: null }) // 隱藏屬性(不會回傳到前端)
  public password: string

  // ---------------- 儲存前雜湊密碼 ------------------
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
  // ------------------------------------------------

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
