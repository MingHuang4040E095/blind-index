import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator' // 驗證
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User' // 使用者

const {
  EncryptedField,
  BlindIndex,
  CipherSweet,
  StringProvider,
  LastFourDigits,
} = require('ciphersweet-js') // 盲索引
// declare const ciphersweet = require('ciphersweet-js') // 盲索引
const provider = new StringProvider(
  // Example key, chosen randomly, hex-encoded:
  Env.get('BLIND_INDEX')
)

const engine = new CipherSweet(provider)

// ------------------ 生成密鑰 -----------------
// const sodium = require('sodium-native')
// let keyMaterial = Buffer.alloc(32, 0)
// sodium.randombytes_buf(keyMaterial)
// console.log(keyMaterial.toString('hex'))

class handleBlindIndex {
  fieldName: string
  value: any
  private blindIndexName: string
  encrypt: any

  constructor(fieldName, value) {
    this.value = value
    this.fieldName = fieldName // 欄位名稱
    this.blindIndexName = `${fieldName}_blind_index` // 盲索引欄位名稱

    this.encrypt = new EncryptedField(engine, fieldName, 'blind_index')
      // Add a blind index for the "last 4 of SSN":
      .addBlindIndex(
        new BlindIndex(
          // Name (used in key splitting):
          // 'contact_ssn_last_four',
          `${this.blindIndexName}_last_four`,
          // List of Transforms:
          [new LastFourDigits()],
          // Bloom filter size (bits)
          16,
          // Fast hash (default: false)
          false
        )
      )
      // Add a blind index for the full SSN:
      .addBlindIndex(new BlindIndex(this.blindIndexName, [], 32))
  }

  async getBlindIndex() {
    const result = await this.encrypt.prepareForStorage(this.value)
    const blind_index = result[1][this.blindIndexName]
    return blind_index
  }
}
export default class UsersController {
  public async userAdd({ request }: HttpContextContract) {
    // console.log(request)

    // 定義期望的數據形狀
    const newUserSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(), // 驗證email格式
        rules.unique({ table: 'users', column: 'email' }), // email不能重複
      ]), // 去頭尾空白
      password: schema.string({ trim: true }, [
        rules.confirmed('passwordConfirmation'), // 確認密碼
      ]), // 去頭尾空白
      name: schema.string({ trim: true }), // 姓名
      // tel: schema.string, // 電話
      // address: schema.string, // 地址
    })

    // 驗證資料
    const payload = await request.validate({ schema: newUserSchema })
    // ------------ 建立盲索引
    // 姓名
    const nameBlindIndex = await new handleBlindIndex('name', payload.name).getBlindIndex()
    console.log(nameBlindIndex)

    // 電話
    const tel = request.body().tel
    const telBlindIndex = await new handleBlindIndex('tel', tel).getBlindIndex()
    console.log(telBlindIndex)

    // 地址
    const address = request.body().address
    const addressBlindIndex = await new handleBlindIndex('address', address).getBlindIndex()
    console.log(addressBlindIndex)

    // 儲存盲索引
    const payloadBlindIndex = {
      email: payload.email,
      password: payload.password,
      name: payload.name,
      nameBlindIndex,
      tel: tel,
      telBlindIndex,
      address: address,
      addressBlindIndex,
    }
    const UserData = await User.create(payloadBlindIndex)
    return UserData
  }
}
