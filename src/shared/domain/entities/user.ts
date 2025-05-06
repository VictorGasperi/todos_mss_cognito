import { STATE, toEnum } from '../enums/state_enum'
import { EntityError } from '../../helpers/errors/domain_errors'

export type UserProps = {
  id: string;
  name: string;
  email: string;
  password: string;
}

export class User {
  constructor (public props: UserProps) {
    if (!User.validateId(props.id)) {
      throw new EntityError('User id')
    }
    this.props.id = props.id

    if (!User.validateName(props.name)) {
      throw new EntityError('User name')
    }
    this.props.name = props.name

    if (!User.validateEmail(props.email)) {
      throw new EntityError('User email')
    }
    this.props.email = props.email

    if (!User.validatePassword(props.password)) {
      throw new EntityError('User password')
    }
    this.props.password = props.password

  }

  get id() {
    return this.props.id
  }

  set setId(id: string) {
    if (!User.validateId(id)) {
      throw new EntityError('User id')
    }
    this.props.id = id
  }

  get name() {
    return this.props.name
  }

  set setName(name: string) {
    if (!User.validateName(name)) {
      throw new EntityError('User name')
    }
    this.props.name = name
  }

  get email() {
    return this.props.email
  }

  set setEmail(email: string) {
    if (!User.validateEmail(email)) {
      throw new EntityError('User email')
    }
    this.props.email = email
  }

  get password() {
    return this.props.password
  }
    
  // static fromJSON(json: JsonProps) {
  //   return new User({
  //     id: json.user_id,
  //     name: json.name,
  //     email: json.email,
  //     state: toEnum(json.state as string)
  //   })
  // }

  // toJSON() {
  //   return {
  //     id: this.id,
  //     name: this.name,
  //     email: this.email,
  //     state: this.state
  //   }
  // }

  static validateId(id: string): boolean {
    if (id == null) {
      return false
    } else if (typeof(id) != 'number') {
      return false
    }
    return true
  }

  static validateName(name: string): boolean {
    if (name == null) {
      return false
    } else if (typeof(name) != 'string') {
      return false
    } else if (name.length < 3) {
      return false
    }
    return true
  }

  static validateEmail(email: string): boolean {
    const regexp = '(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$)'

    if (email == null) {
      return false
    }
    if (typeof(email) != 'string') {
      return false
    }
    if (!email.match(regexp)) {
      return false
    }
    return true
  }

  static validatePassword(password: String): boolean {
    if (password == null) {
      return false
    } 

    if (typeof(password) != 'string'){
      return false
    }


    return true
  }

}