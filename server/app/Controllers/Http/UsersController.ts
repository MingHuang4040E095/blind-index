import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async userAdd({ request }: HttpContextContract) {
    console.log(request)
    return request.body()
  }
}
