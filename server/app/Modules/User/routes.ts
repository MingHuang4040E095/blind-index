import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post('/userAdd', 'UsersController.userAdd').as('userAdd')
})
  .prefix('/user')
  .as('user')
