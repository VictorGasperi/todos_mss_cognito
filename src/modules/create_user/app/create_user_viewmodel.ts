import { UserProps } from '@/shared/domain/entities/user'

export class CreateUserViewmodel {
  private id?: string
  private name: string
  private email: string

  constructor(props: UserProps) {
    this.id = props.id
    this.email = props.email
    this.name = props.name
  }

  // toJSON() {
  //   return JSON.stringify({
  //     user: {
  //       id: this.id,
  //       name: this.name,
  //       email: this.email,
  //     },
  //     message: 'The user was created successfully'
  //   })
  // }

  toJSON() {
    return {
      user: {
        id: this.id,
        name: this.name,
        email: this.email,
      },
      message: 'The user was created successfully',
    }
  }
}
