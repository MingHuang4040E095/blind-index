import { DateTime } from 'luxon'
import { BaseModel, column, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import Hash from '@ioc:Adonis/Core/Hash'
import Encryption from '@ioc:Adonis/Core/Encryption' // 加密

const encryptConfig = {
  prepare: (value: string) => Encryption.encrypt(value), // 存到資料庫前
  consume: (value: string) => Encryption.decrypt(value), // 從資料庫取出來之後
}
export default class User extends BaseModel {
  // 使用者id
  @column({ isPrimary: true })
  public id: number

  // 姓名
  @column(encryptConfig)
  public name: string

  // 姓名 盲索引
  @column()
  public nameBlindIndex: string

  // 電話
  @column(encryptConfig)
  public tel: string

  // 電話 盲索引
  @column()
  public telBlindIndex: string

  // 地址
  @column(encryptConfig)
  public address: string

  // 地址 盲索引
  @column()
  public addressBlindIndex: string

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
