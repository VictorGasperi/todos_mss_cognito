import { User } from "../../domain/entities/user";
import { IUserRepository } from "../../domain/repositories/user_repository_interface";
import { DuplicatedItem, InvalidCredentials, NoItemsFound, UserAlreadyConfirmed } from "../../helpers/errors/usecase_errors";


export class UserRepositoryMock implements IUserRepository {

    private users: User[] = [
        new User({
            id: "1",
            name: "Victor Gasperi",
            email: "email@email.com",
            password: "pass"
        }),
        new User({
            id: "2",
            name: "Gasperi Victor",
            email: "email2@email.com",
            password: "pass2"
        }),
        new User({
            id: "3",
            name: "Jose Augusto",
            email: "email3@email.com",
            password: "pass3"
        })
    ]

    private confirmed_users: User[] = [ this.users[2] ]

    async getAllUsers(): Promise<User[]> {
        return this.users
    }

    async getUserByEmail(email: string): Promise<User> {
        for (const user of this.users) {
            if ( user.email === email ) return user
        }

        throw new NoItemsFound('User email')
    }

    async createUser(name: string, email: string, password: string): Promise<User> {
        
        for (let user of this.users) {
            if (user.email === email) throw new DuplicatedItem('user email')
        }

        const user = new User({
            id: (this.users.length + 1).toString(),
            name,
            email,
            password
        });

        this.users.push(user)

        return user
        
    }

    async updateUser(email: string, new_name?: string, new_password?: string): Promise<User> {
        
        const user = await this.getUserByEmail(email)

        if (new_name !== undefined) {
            user.setName = new_name
        }

        if (new_password !== undefined) {
            user.setPassword = new_password
        }

        return user

    }

    async deleteUser(email: string): Promise<User> {
        
        const user_to_delete = await this.getUserByEmail(email)

        this.users = this.users.filter( user => user.email !== email )

        return user_to_delete

    }

    async confirmUserEmail(email: string, code: number): Promise<boolean> {
        
        const user = await this.getUserByEmail(email)

        if (this.confirmed_users.includes(user)) throw new UserAlreadyConfirmed("user")

        if (code !== 123456) throw new InvalidCredentials('confirmation code')

        this.confirmed_users.push(user)

        return true

    }

    async loginUser(email: string, password: string): Promise<void | { [key: string]: string; }> {
        
        const user = await this.getUserByEmail(email)
        const dict_response:  { [key: string]: string } = {}

        if (user.password === password) {
            dict_response["access_token"] = "valid_access_token-" + user.email
            dict_response["refresh_token"] = "valid_refresh_token-" + user.email
            dict_response["id_token"] = "valid_id_token-" + user.email

            return dict_response
        }

    }

    async checkToken(token: string): Promise< null | { [key: string]: string; }> {
        
        const token_parts = token.split('-')

        if (token_parts.length !== 2 || token_parts[0] !== "valid_access_token") throw new InvalidCredentials('access token')

        const user_email = token_parts[1]
        const user = await this.getUserByEmail(user_email)

        if (user === undefined ) return null

        return user.toDict()

    }

    async refreshToken(refresh_token: string): Promise< null | { [key: string]: string; }> {
        
        const token_parts = refresh_token.split('-')

        if (token_parts.length !== 2 || token_parts[0] !== "valid_refresh_token") throw new InvalidCredentials('refresh token')

        const user_email = token_parts[1]

        const user = await this.getUserByEmail(user_email)

        if (user === undefined) return null

        return {
            "access_token": "valid_access_token-" + user_email,
            "refresh_token": "valid_refresh_token-" + user_email,
            "id_token": "valid_id_token-" + user_email
        }

    }
}