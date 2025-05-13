import { User } from '../entities/user'

export interface IUserRepository {
  // getAllUsers(): Promise<User[]>
  getUserByEmail(email: string): Promise<User | undefined>
  createUser(name: string, email: string, password: string): Promise<User | undefined>
  // confirmUserEmail(email: string, code: number): Promise<boolean>
  loginUser(email: string, password: string): Promise<void | { [key: string]: string | undefined }>
  checkToken(token: string): Promise< { [key: string]: string } | undefined >
  refreshToken(refresh_token: string): Promise< { [key: string]: string | undefined } | undefined >
}