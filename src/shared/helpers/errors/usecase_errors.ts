import { BaseError } from './base_error'

export class NoItemsFound extends BaseError {
  constructor(message: string) {
    super(`No items found for ${message}`)
  }

}

export class DuplicatedItem extends BaseError {
  constructor(message: string) {
    super(`The item already exists for this ${message}`)
  }

}

export class ForbiddenAction extends BaseError {
  constructor(message: string) {
    super(`The action is forbidden for this ${message}`)
  }
}

export class UserAlreadyConfirmed extends BaseError {
  constructor(message: string) {
    super(`The user email is already confirmed. Context: ${message}`)
  }
}

export class InvalidCredentials extends BaseError {
  constructor(message: string) {
    super(`${message}`)
  }
}

export class EmailNotVerified extends BaseError {
  constructor(message: string) {
    super(`${message}`)
  }
}