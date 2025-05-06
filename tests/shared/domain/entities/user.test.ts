import { User } from '../../../../src/shared/domain/entities/user'
import { EntityError } from '../../../../src/shared/helpers/errors/domain_errors'

describe('[User Entity Tests]', () => {
  it('should create a valid User entity', () => {
    const user = new User({
      id: 'f8d9d4b3-b15a-4fcd-b6ea-xxxxxxxxxxxx',
      name: 'Victor Gasperi',
      email: 'email1@email.com',
      password: 'minhaSenhaForte'
    });

    expect(user).toBeInstanceOf(User);
  });

  it('should throw an EntityError when name is invalid', () => {
    expect(() => {
      new User({
        id: 'f8d9d4b3-b15a-4fcd-b6ea-xxxxxxxxxxxx',
        name: '',
        email: 'email1@email.com',
        password: 'minhaSenhaForte'
      });
    }).toThrow(EntityError);

    expect(() => {
      new User({
        id: 'f8d9d4b3-b15a-4fcd-b6ea-xxxxxxxxxxxx',
        name: '',
        email: 'email1@email.com',
        password: 'minhaSenhaForte'
      });
    }).toThrow('Field User name is not valid');
  });

  it('should thorw an EntityError when email is invalid', () => {
    expect( () => {
      new User({
        id: 'f8d9d4b3-b15a-4fcd-b6ea-xxxxxxxxxxxx',
        name: 'Victor',
        email: '',
        password: 'senhaforte123'
      })
    }).toThrow('Field User email is not valid')
  });

  it('should thorw an EntityError when password is invalid', () => {
    expect( () => {
      new User({
        id: 'f8d9d4b3-b15a-4fcd-b6ea-xxxxxxxxxxxx',
        name: 'Victor',
        email: 'email1@email.com',
        password: ''
      })
    }).toThrow('Field User password is not valid')
  });
});
