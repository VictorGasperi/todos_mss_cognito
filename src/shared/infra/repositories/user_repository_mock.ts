import { User } from "@/shared/domain/entities/user";
import { IUserRepository } from "@/shared/domain/repositories/user_repository_interface";
import { DuplicatedItem, NoItemsFound } from "@/shared/helpers/errors/usecase_errors";


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

    async getAllUsers(): Promise<User[]> {
        return this.users
    }

    async getUserByEmail(email: string): Promise<User> {
        for (const user of this.users) {
            if ( user.email === email) return user
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

        if (new_name != undefined) {
            user.setName = new_name
        }

        if (new_password != undefined) {
            user.setPassword = new_password
        }

        return user

    }

}