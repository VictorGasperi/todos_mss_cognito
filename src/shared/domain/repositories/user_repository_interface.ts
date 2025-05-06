import { User } from '../entities/user'

export interface IUserRepository {
  getAllUsers(): Promise<User[]>
  createUser(user: User): Promise<User>
  updateUser(id: string, kvp_to_update: {[key: string]: string}): Promise<User>
  deleteUser(id: string): Promise<User>
  confirmUserEmail(id: string, code: number): Promise<boolean>
  loginUser(email: string, password: string): Promise<{ [key: string]: string }>
  checkToken(token: string): Promise< { [key: string]: string } >
  refreshToken(refresh_token: string): Promise<{ [key: string]: string }>
}