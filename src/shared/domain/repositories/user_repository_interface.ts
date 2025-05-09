import { User } from '../entities/user'

export interface IUserRepository {
  getAllUsers(): Promise<User[]>
  getUserByEmail(email: string): Promise<User>
  createUser(name: string, email: string, password: string): Promise<User>
  confirmUserEmail(email: string, code: number): Promise<boolean>
  loginUser(email: string, password: string): Promise<void | { [key: string]: string; }>
  checkToken(token: string): Promise< null | { [key: string]: string } >
  refreshToken(refresh_token: string): Promise< null | { [key: string]: string }>
}