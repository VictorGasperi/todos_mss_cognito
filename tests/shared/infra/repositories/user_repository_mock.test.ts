import { DuplicateItemException } from '@aws-sdk/client-dynamodb';
import { User } from '../../../../src/shared/domain/entities/user';
import { DuplicatedItem, InvalidCredentials, NoItemsFound, UserAlreadyConfirmed } from '../../../../src/shared/helpers/errors/usecase_errors';
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

        const is_user_verified = await repo.confirmUserEmail('email2@email.com', 123456)

        expect(is_user_verified).toBe(true)

    });

    it("Should throw an UserAlreadyConfirmed error", async () => {

        const repo = new UserRepositoryMock()

        const is_user_verified = repo.confirmUserEmail('email3@email.com', 123456)

        expect(is_user_verified)
        .rejects
        .toThrow(UserAlreadyConfirmed)

    });

    it("Should throw an InvalidCredentials error", () => {

        const repo = new UserRepositoryMock()

        expect(
            repo.confirmUserEmail('email2@email.com', 654321)
        )
        .rejects
        .toThrow(InvalidCredentials)
    });

    it("Should login an user", async () => {

        const repo = new UserRepositoryMock()
        const user_credentials = await repo.loginUser('email3@email.com', 'pass3')

        const expected = {
            "access_token": "valid_access_token-email3@email.com",
            "refresh_token": "valid_refresh_token-email3@email.com",
            "id_token": "valid_id_token-email3@email.com"
        }

        expect(user_credentials).toEqual(expected)

    });

    it("Should check the user token and retrieve its information", async () => {

        const repo = new UserRepositoryMock()
        const user_info = await repo.checkToken("valid_access_token-email@email.com")

        const expected = { 
            "user_id": "1",
            "user_name": "Victor Gasperi",
            "user_email": "email@email.com"
        }

        expect(user_info).toEqual(expected)

    });

    it("Should throw an InvalidCredentials for the access token",  () => {
        const repo = new UserRepositoryMock()
        const user_info = repo.checkToken("invalid_token")

        expect(user_info)
        .rejects
        .toThrow(InvalidCredentials)

    });

    it("Should update the tokens with a valid refresh_token", async () => {

        const repo = new UserRepositoryMock()
        const new_user_credentials = await repo.refreshToken("valid_refresh_token-email3@email.com")

        const expected = {
            "access_token": "valid_access_token-email3@email.com",
            "refresh_token": "valid_refresh_token-email3@email.com",
            "id_token": "valid_id_token-email3@email.com"
        }

        expect(new_user_credentials).toEqual(expected)

    });

    it("Should throw an InvalidCredentials for the refresh_token", () => {

        const repo = new UserRepositoryMock()

        expect(
            repo.refreshToken('invalid_refresh_token')
        )
        .rejects
        .toThrow(InvalidCredentials)
    });

})