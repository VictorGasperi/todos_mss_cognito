import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { CreateUserUsecase } from '../../../../src/modules/create_user/app/create_user_usecase' 
import { User } from '../../../../src/shared/domain/entities/user';
import { DuplicatedItem } from '../../../../src/shared/helpers/errors/usecase_errors'
 

describe('Assert Create User usecase is correct', () => {
    
    it("Should execute usecase correctly", async () => {

        const repo = new UserRepositoryMock()
        const usecase = new CreateUserUsecase(repo)

        const user = await usecase.execute('Gasperi', 'gasperi@email.com', 'SenhaForte123!') as User

        expect(user.props).toEqual({
            id: "4",
            name: 'Gasperi',
            email: 'gasperi@email.com',
            password: 'SenhaForte123!'
        })

    });

    it('Should throw a DuplicatedItem error', async () => {

        const repo = new UserRepositoryMock()
        const usecase = new CreateUserUsecase(repo)

        expect( async () => {
            await usecase.execute('Gasperi', 'email2@email.com', 'PassNova')
        })
        .rejects
        .toThrow(DuplicatedItem)

    })

} )