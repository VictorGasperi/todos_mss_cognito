import { NoItemsFound } from "../../../shared//helpers/errors/usecase_errors";
import { IUserRepository } from "../../../shared/domain/repositories/user_repository_interface";

export class CreateUserUsecase {
    constructor(private repo: IUserRepository) {}

    async execute(name: string, email: string, password: string) {

        const user = await this.repo.createUser(name, email, password)

        return user

    }

}