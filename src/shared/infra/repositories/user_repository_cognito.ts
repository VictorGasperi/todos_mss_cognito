import { User } from '../../domain/entities/user'
import { IUserRepository } from '../../../../src/shared/domain/repositories/user_repository_interface'
import { Environments } from '../../../../src/shared/environments'
import {
  CognitoIdentityProviderClient,
  AdminGetUserCommand,
  UserNotFoundException,
  NotAuthorizedException,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  InitiateAuthCommand,
  AuthFlowType,
  GetUserCommand,
} from '@aws-sdk/client-cognito-identity-provider'
import { CognitoAttributes, UserCognitoDTO } from '../dto/user_cognito_dto'
import { EmailNotVerified, InvalidCredentials } from '../../../../src/shared/helpers/errors/usecase_errors'

type id_type = {
  user_pool_id: string
  client_id: string
}

export class UserRepositoryCognito implements IUserRepository {
  private client = new CognitoIdentityProviderClient({
    region: Environments.getEnvs().region,
  })

  private IDs: id_type = {
    user_pool_id: Environments.getEnvs().cognitoUserPoolId,
    client_id: Environments.getEnvs().cognitoClientId,
  }

  async getUserByEmail(email: string): Promise< User | undefined > {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.IDs.user_pool_id,
        Username: email,
      })

      const response = await this.client.send(command)

      const user = UserCognitoDTO.fromCognito(response).toEntity()

      return user
    } catch (err: any) {
      throw err
    }
  }

  async createUser(
    user_name: string,
    user_email: string,
    user_password: string,
  ): Promise< User | undefined > {
    const user = new User({
      name: user_name,
      email: user_email,
      password: user_password,
    })

    const cognito_attr = UserCognitoDTO.fromEntity(user).toCognitoAttributes()

    try {

        const command = new AdminCreateUserCommand({
            UserPoolId: this.IDs.user_pool_id,
            Username: user_email,
            UserAttributes: cognito_attr
        })

        const response: any = await this.client.send(command)

        await this.client.send(new AdminSetUserPasswordCommand({
            UserPoolId: this.IDs.user_pool_id,
            Username: user_email,
            Password: user_password,
            Permanent: true
        }))

        const user_id = response.User?.Attributes?.find( (attr: CognitoAttributes) => attr.Name === 'sub') as CognitoAttributes
        user.setId = user_id?.Value

        return user
    } catch (err) {
        throw err
    }
  }

  async loginUser(email: string, password: string): Promise< void | { [key: string]: string | undefined } > {
      
    try {

        const authCommand = new InitiateAuthCommand({
            AuthFlow: "USER_PASSWORD_AUTH" as AuthFlowType,
            ClientId: this.IDs.client_id,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        });

        const authResponse = await this.client.send(authCommand)
        const accessToken = authResponse.AuthenticationResult?.AccessToken

        if(!accessToken) throw new InvalidCredentials("Access Token not returned")

        const getUserCommand = new GetUserCommand( { AccessToken: accessToken} )
        const cognitoUser = await this.client.send(getUserCommand)

        const emailVerified = cognitoUser.UserAttributes?.find( (attr) => attr?.Name === 'email_verified')?.Value === 'true';

        if (!emailVerified) throw new EmailNotVerified('')
    
        return {
            "access_token": accessToken,
            "refresh_token": authResponse.AuthenticationResult?.RefreshToken,
            "id_token": authResponse.AuthenticationResult?.IdToken
        }

    } catch (err) {
        throw err
    }

  }

  async checkToken(token: string): Promise< { [key: string]: string; } | undefined > {
      
    try {

        const getUserCommand = new GetUserCommand({
            AccessToken: token
        });

        const getUserResponse = await this.client.send(getUserCommand)

        return UserCognitoDTO.fromCognito(getUserResponse).toEntity().toDict()

    } catch (err) {
        throw err
    }

  }

  async refreshToken(refresh_token: string): Promise< { [key: string]: string | undefined ; } | undefined > {
      
    try {

        const authCommand = new InitiateAuthCommand({
            AuthFlow: "REFRESH_TOKEN_AUTH" as AuthFlowType,
            ClientId: this.IDs.client_id,
            AuthParameters: {
                REFRESH_TOKEN: refresh_token
            }
        });

        const authResponse = await this.client.send(authCommand)

        return {
            "access_token": authResponse.AuthenticationResult?.AccessToken,
            "refresh_token": authResponse.AuthenticationResult?.RefreshToken,
            "id_token": authResponse.AuthenticationResult?.IdToken
        }

    } catch (err) {
        throw err
    }

  }

}
