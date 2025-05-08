import { User } from '../entities/user'

export interface IUserRepository {
  getAllUsers(): Promise<User[]>
  getUserByEmail(email: string): Promise<User>
  createUser(name: string, email: string, password: string): Promise<User>
  updateUser(email: string, new_name?: string, new_password?: string): Promise<User>
  deleteUser(email: string): Promise<User>
  confirmUserEmail(email: string, code: number): Promise<boolean>
  loginUser(email: string, password: string): Promise<void | { [key: string]: string; }>
  checkToken(token: string): Promise< { [key: string]: string } >
  refreshToken(refresh_token: string): Promise<{ [key: string]: string }>
}