import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { CreateUserUsecase } from '../../../../src/modules/create_user/app/create_user_usecase'
import { CreateUserController } from '../../../../src/modules/create_user/app/create_user_controller'
import { HttpRequest } from '../../../../src/shared/helpers/external_interfaces/http_models'

describe('Assert Create User controller is correct', () => {
  it('Should activate the controller correctly', async () => {
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(
      { email: 'victor@email.com', name: 'Meu nome', password: 'Senha forte' },
      undefined,
      undefined,
    )

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(201)
    expect(response?.body['user']['id']).toBe('4')
    expect(response?.body['user']['name']).toBe('Meu nome')
    expect(response?.body['user']['email']).toBe('victor@email.com')
    expect(response?.body['message']).toBe('The user was created successfully')
  });

  
  it('Should return 400 statusCode when did not pass email', async () => {

    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(
      { name: 'Meu nome', password: 'Senha forte' },
      undefined,
      undefined,
    )

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field user email is missing')

  })
  it('Should return 400 statusCode when did not pass name', async () => {

    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(
      { email: 'victor@email.com', password: 'Senha forte' },
      undefined,
      undefined,
    )

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field user name is missing')

  })
  it('Should return 400 statusCode when did not pass password', async () => {

    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(
      { email: 'victor@email.com', name: 'Meu nome' },
      undefined,
      undefined,
    )

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field user password is missing')

  })

  it('Should return 400 statusCode when pass email incorrect type', async () => {
    
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(
      { email: 123, name: 'Meu nome', password: 'Senha forte' },
      undefined,
      undefined,
    )

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field email isn\'t in the right type.\n Received: number.\n Expected: string.')

  })

  it('Should return 400 statusCode when pass email incorrect type', async () => {
    
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(
      { email: 'victor@email.com', name: false, password: 'Senha forte' },
      undefined,
      undefined,
    )

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field name isn\'t in the right type.\n Received: boolean.\n Expected: string.')

  })

  it('Should return 400 statusCode when pass email incorrect type', async () => {
    
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(
      { email: 'victor@email.com', name: 'Meu nome', password: [] },
      undefined,
      undefined,
    )

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field password isn\'t in the right type.\n Received: object.\n Expected: string.')

  })

  it('Should return 400 statusCode when pass email incorrect format', async () => {
    
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(
      { email: 'victor', name: 'Meu nome', password: 'senhaforte' },
      undefined,
      undefined,
    )

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field User email is not valid')

  })

  it('Should return 400 statusCode when pass email incorrect format', async () => {
    
    const repo = new UserRepositoryMock()
    const usecase = new CreateUserUsecase(repo)
    const controller = new CreateUserController(usecase)

    const request = new HttpRequest(
      { email: 'victor@email.com', name: 'Meu nome', password: '' },
      undefined,
      undefined,
    )

    const response = await controller.handle(request)

    expect(response?.statusCode).toEqual(400)
    expect(response?.body).toBe('Field User password is not valid')

  })

})
