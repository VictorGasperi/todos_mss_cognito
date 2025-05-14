import {
  MissingParameters,
  WrongTypeParameters,
} from '../../../shared/helpers/errors/controller_errors'
import { IRequest } from '../../../shared/helpers/external_interfaces/external_interface'
import { CreateUserUsecase } from './create_user_usecase'
import { CreateUserViewmodel } from './create_user_viewmodel'
import { User } from '../../../shared/domain/entities/user'
import { NoItemsFound } from '../../../shared/helpers/errors/usecase_errors'
import { EntityError } from '../../../shared/helpers/errors/domain_errors'
import { BadRequest, Created, InternalServerError, NotFound } from '../../../shared/helpers/external_interfaces/http_codes'

export class CreateUserController {
  constructor(private usecase: CreateUserUsecase) {}

  async handle(request: IRequest) {
    try {
      if (request.data.email === undefined)
        throw new MissingParameters('user email')
      if (request.data.name === undefined)
        throw new MissingParameters('user name')
      if (request.data.password === undefined)
        throw new MissingParameters('user password')

      if (typeof request.data.email !== 'string')
        throw new WrongTypeParameters(
          'email',
          'string',
          typeof request.data.email,
        )
      if (typeof request.data.name !== 'string')
        throw new WrongTypeParameters(
          'name',
          'string',
          typeof request.data.name,
        )
      if (typeof request.data.password !== 'string')
        throw new WrongTypeParameters(
          'password',
          'string',
          typeof request.data.password,
        )

      const user = (await this.usecase.execute(
        request.data.name,
        request.data.email,
        request.data.password,
      )) as User

      const viewmodel = new CreateUserViewmodel(user.props)

      return new Created(viewmodel.toJSON())
      
    } catch (error: any) {
      if (error instanceof NoItemsFound) {
        return new NotFound(error.message)
      }
      if (error instanceof MissingParameters) {
        return new BadRequest(error.message)
      }
      if (error instanceof WrongTypeParameters) {
        return new BadRequest(error.message)
      }
      if (error instanceof EntityError) {
        return new BadRequest(error.message)
      }
      if (error instanceof Error) {
        return new InternalServerError(error.message)
      }
    }
  }
}
