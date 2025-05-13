import { UserCognitoDTO, CognitoAttributes } from '../../../../src/shared/infra/dto/user_cognito_dto';
import { User } from '../../../../src/shared/domain/entities/user';

describe('UserCognitoDTO', () => {
  describe('Constructor', () => {
    it('should create a new instance with all properties', () => {
      const props = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword'
      };

      const dto = new UserCognitoDTO(props);

      expect(dto).toBeInstanceOf(UserCognitoDTO);
      expect(dto).toEqual(expect.objectContaining(props));
    });

    it('should create a new instance without id', () => {
      const props = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword'
      };

      const dto = new UserCognitoDTO(props);

      expect(dto).toBeInstanceOf(UserCognitoDTO);
      expect(dto).toEqual(expect.objectContaining(props));
      expect(dto).toHaveProperty('id', undefined);
    });

    it('should create a new instance with null password', () => {
      const props = {
        name: 'John Doe',
        email: 'john@example.com',
        password: null
      };

      const dto = new UserCognitoDTO(props);

      expect(dto).toBeInstanceOf(UserCognitoDTO);
      expect(dto).toEqual(expect.objectContaining(props));
    });
  });

  describe('fromEntity', () => {
    it('should create a DTO from User entity', () => {
      const user = new User({
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword'
      });

      const dto = UserCognitoDTO.fromEntity(user);

      expect(dto).toBeInstanceOf(UserCognitoDTO);
      expect(dto).toEqual(expect.objectContaining({
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password
      }));
    });
  });

  describe('toCognitoAttributes', () => {
    it('should convert to Cognito attributes format', () => {
      const props = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword'
      };

      const dto = new UserCognitoDTO(props);
      const attributes = dto.toCognitoAttributes();

      expect(attributes).toEqual([
        { Name: 'name', Value: props.name },
        { Name: 'email', Value: props.email }
      ]);
    });

    it('should not include password in Cognito attributes', () => {
      const props = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword'
      };

      const dto = new UserCognitoDTO(props);
      const attributes = dto.toCognitoAttributes();

      expect(attributes).toHaveLength(2);
      expect(attributes).not.toContainEqual(expect.objectContaining({ Name: 'password' }));
    });
  });

  describe('fromCognito', () => {
    it('should create a DTO from Cognito user data', () => {
      const cognitoUser = {
        UserAttributes: [
          { Name: 'sub', Value: 'cognito-id-123' },
          { Name: 'name', Value: 'Jane Doe' },
          { Name: 'email', Value: 'jane@example.com' }
        ]
      };

      const dto = UserCognitoDTO.fromCognito(cognitoUser);

      expect(dto).toBeInstanceOf(UserCognitoDTO);
      expect(dto).toEqual(expect.objectContaining({
        id: 'cognito-id-123',
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: null
      }));
    });

    it('should handle missing attributes gracefully', () => {
      const cognitoUser = {
        UserAttributes: [
          { Name: 'sub', Value: 'cognito-id-123' }
          // name and email are missing
        ]
      };

      const dto = UserCognitoDTO.fromCognito(cognitoUser);

      expect(dto).toBeInstanceOf(UserCognitoDTO);
      expect(dto).toEqual(expect.objectContaining({
        id: 'cognito-id-123',
        name: '',
        email: '',
        password: null
      }));
    });

    it('should handle empty user data', () => {
      const dto = UserCognitoDTO.fromCognito({});

      expect(dto).toBeInstanceOf(UserCognitoDTO);
      expect(dto).toEqual(expect.objectContaining({
        id: '',
        name: '',
        email: '',
        password: null
      }));
    });
  });

  describe('toEntity', () => {
    it('should convert to User entity', () => {
      const props = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securePassword'
      };

      const dto = new UserCognitoDTO(props);
      const user = dto.toEntity();

      expect(user).toBeInstanceOf(User);
      expect(user).toEqual(expect.objectContaining(props));
    });

    it('should convert to User entity with null password', () => {
      const props = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        password: null
      };

      const dto = new UserCognitoDTO(props);
      const user = dto.toEntity();

      expect(user).toBeInstanceOf(User);
      expect(user).toEqual(expect.objectContaining(props));
    });
  });
});