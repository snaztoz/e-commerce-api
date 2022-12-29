/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

const routes = () => {
  // projects
  Route.group(() => {
    Route.group(() => {
      Route.get('/types', 'ProjectsController.types')

      // project contents
      Route.group(() => {
        Route.get('/:projectId/parts/:partId/content', 'ProjectsController.showContent')
        Route.put('/:projectId/parts/:partId/content', 'ProjectsController.updateContent')
      }).middleware('auth')
    }).prefix('/projects')

    Route.resource('projects', 'ProjectsController')
      .apiOnly()
      .except(['update'])
      .middleware({ '*': ['auth'] })
  })

  // subscriptions
  Route.group(() => {
    Route.get('/available-plans', 'SubscriptionsController.availablePlans')
  }).prefix('/subscriptions')

  // users
  Route.group(() => {
    Route.post('/signup', 'UsersController.signup')
    Route.post('/login', 'UsersController.login')
    Route.post('/logout', 'UsersController.logout').middleware('auth')
    Route.get('/profile', 'UsersController.profile').middleware('auth')
  }).prefix('/users')
}

// prefix all API with '/api' path
Route.group(routes).prefix('/api')
