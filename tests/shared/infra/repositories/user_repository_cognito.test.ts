import { UserRepositoryCognito } from '../../../../src/shared/infra/repositories/user_repository_cognito'
import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider'
import { mockClient } from 'aws-sdk-client-mock'
import { User } from '../../../../src/shared/domain/entities/user'
import { EmailNotVerified } from '../../../../src/shared/helpers/errors/usecase_errors'

const cognitoMock = mockClient(CognitoIdentityProviderClient)

describe('UserRepositoryCognito', () => {
  let repo: UserRepositoryCognito

  beforeEach(() => {
    cognitoMock.reset()
    repo = new UserRepositoryCognito()
  })

  it('should create a user successfully', async () => {
    cognitoMock.onAnyCommand().resolves({
      User: {
        Attributes: [
          { Name: 'sub', Value: '123' },
          { Name: 'email', Value: 'test@example.com' },
          { Name: 'name', Value: 'Test User' },
        ],
      },
    })

    const user = await repo.createUser(
      'Test User',
      'test@example.com',
      'Password123!',
    )

    expect(user).toBeInstanceOf(User)
    expect(user?.email).toBe('test@example.com')
    expect(user?.id).toBe('123')
  })

  it('should return user by email', async () => {
    cognitoMock.onAnyCommand().resolves({
      Username: 'test@example.com',
      UserAttributes: [
        { Name: 'name', Value: 'Test User' },
        { Name: 'email', Value: 'test@example.com' },
        { Name: 'sub', Value: '123' },
      ],
    })

    const user = await repo.getUserByEmail('test@example.com')

    expect(user).toBeInstanceOf(User)
    expect(user?.email).toBe('test@example.com')
    expect(user?.id).toBe('123')
  })

  it('should login user and return tokens', async () => {
    cognitoMock
      .onAnyCommand()
      .resolvesOnce({
        AuthenticationResult: {
          AccessToken: 'access-token',
          RefreshToken: 'refresh-token',
          IdToken: 'id-token',
        },
      })
      .resolvesOnce({
        UserAttributes: [
          { Name: 'email_verified', Value: 'true' },
          { Name: 'email', Value: 'test@example.com' },
        ],
      })

    const result = await repo.loginUser('test@example.com', 'Password123!')

    expect(result?.access_token).toBe('access-token')
    expect(result?.refresh_token).toBe('refresh-token')
    expect(result?.id_token).toBe('id-token')
  })

  it('should throw error if email not verified during login', async () => {
    cognitoMock
      .onAnyCommand()
      .resolvesOnce({
        AuthenticationResult: {
          AccessToken: 'access-token',
        },
      })
      .resolvesOnce({
        UserAttributes: [{ Name: 'email_verified', Value: 'false' }],
      })

    await expect(
      repo.loginUser('test@example.com', 'Password123!'),
    ).rejects.toThrow(new EmailNotVerified(''))
  })
  it('should return user data from valid access token', async () => {
  
  const mockToken = 'valid_token_123';
  const expectedUser = {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
  };

  cognitoMock
    .on(GetUserCommand, { AccessToken: mockToken })
    .resolves({
      Username: expectedUser.email,
      UserAttributes: [
        { Name: 'sub', Value: expectedUser.id },
        { Name: 'name', Value: expectedUser.name },
        { Name: 'email', Value: expectedUser.email },
      ],
    });

  
  const result = await repo.checkToken(mockToken);

    const expectedResponse = {

      "user_id": expectedUser.id,
      "user_name": expectedUser.name,
      "user_email": expectedUser.email

    }

  
  expect(result).toEqual(expectedResponse);
  expect(cognitoMock.calls()).toHaveLength(1);
  expect(cognitoMock.calls()[0].args[0].input).toEqual({
    AccessToken: mockToken,
  });
});

it('should throw when invalid token is provided', async () => {
  cognitoMock
    .on(GetUserCommand)
    .rejects({
      name: 'NotAuthorizedException',
      message: 'Invalid token'
    });

  await expect(repo.checkToken('invalid_token'))
    .rejects
    .toThrow('Invalid token');
});

  it('should refresh token and return new tokens', async () => {
    cognitoMock.onAnyCommand().resolves({
      AuthenticationResult: {
        AccessToken: 'new-access-token',
        RefreshToken: 'new-refresh-token',
        IdToken: 'new-id-token',
      },
    })

    const result = await repo.refreshToken('some-refresh-token')

    expect(result?.access_token).toBe('new-access-token')
  })
})
