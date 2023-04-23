import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator' // 驗證
import User from 'App/Models/User' // 使用者
export default class UsersController {
  public async userAdd({ request }: HttpContextContract) {
    console.log(request)

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
    })
    // 驗證資料
    const payload = await request.validate({ schema: newUserSchema })
    const UserData = await User.create(payload)
    return UserData
  }
}
