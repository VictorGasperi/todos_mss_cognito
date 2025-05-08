import { DuplicateItemException } from '@aws-sdk/client-dynamodb';
import { User } from '../../../../src/shared/domain/entities/user';
import { DuplicatedItem, NoItemsFound } from '../../../../src/shared/helpers/errors/usecase_errors';
import { UserRepositoryMock } from '../../../../src/shared/infra/repositories/user_repository_mock'
import { isEqual, reject } from 'lodash';


describe("Assert User Repository Mock is correct", () => {

    it("Should retrieve all users", async () => {

        const repo = new UserRepositoryMock()

        const users = await repo.getAllUsers()

        expect(users.length === 3)
        expect(users[2].name === "Gasperi Victor")

    });

    it("Should get user by email", async () => {

        const repo = new UserRepositoryMock()
        const user = await repo.getUserByEmail('email3@email.com')

        expect(user.name === "Jose Augusto")

    });

    it("Shoud throw a NoItemsFound error", async () => {

        const repo = new UserRepositoryMock()
        
        await expect(
            repo.getUserByEmail('emailNaoExistente')
        )
        .rejects
        .toThrow(NoItemsFound)

    })

    it("Should create a new user", async () => {

        const repo = new UserRepositoryMock()

        const user = await repo.createUser("Yasmin", "yasmin@email.com", "SenhaForte123!")
        
        const expected_user = {
            "user_id": "4",
            "user_name": "Yasmin",
            "user_email": "yasmin@email.com"
        }

        expect((await repo.getAllUsers()).length === 4)
        expect(user.toDict()).toEqual(expected_user)

    });

    it("Should throw a DuplicatedItem", async () => {

        const repo = new UserRepositoryMock()
        await expect(
            repo.createUser("Victor Gasperii", "email@email.com", "passs")
        )
        .rejects
        .toThrow(DuplicatedItem)

    })

    it("Should update an user", async () => {

        const repo = new UserRepositoryMock()

        const user = await repo.updateUser("email2@email.com", "Valentin")

        const all_users = await repo.getAllUsers()

        const expected_user = user.toDict()

        expect( all_users[1].toDict() ).toEqual(expected_user)

    });

    it("Should delete an user", async () => {

        const repo = new UserRepositoryMock()
        const user_deleted = await repo.deleteUser("email2@email.com")
        const all_users = await repo.getAllUsers()

        expect(all_users.length).toBe(2)
        expect(user_deleted.name).toEqual("Gasperi Victor")

    });

    it("Should confirm an user email", async () => {

        const repo = new UserRepositoryMock()


    })

})