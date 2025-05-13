import { User } from "../../../shared/domain/entities/user"

type UserCognitoDTOProps = {
  id?: string
  name: string
  email: string
  password: string | null
}

export type CognitoAttributes = {
    Name: string
    Value: string
}

export class UserCognitoDTO {

    private id?: string
    private name: string
    private email: string
    private password: string | null

    constructor (props: UserCognitoDTOProps) {
        this.id = props.id
        this.name = props.name
        this.email = props.email
        this.password = props.password
    }

    static fromEntity(user: User): UserCognitoDTO {

        return new UserCognitoDTO({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password
        })
    }

    toCognitoAttributes(): CognitoAttributes[] {
        return [
            {
                Name: "name",
                Value: this.name
            },
            {
                Name: "email",
                Value: this.email
            }
        ]
    }

    static fromCognito(userData: any): UserCognitoDTO {

        
        const user_attributes = userData?.UserAttributes as CognitoAttributes[]
        
        const getAttr = (attrName: string): string => user_attributes?.find( (cognitoAttr: CognitoAttributes) => cognitoAttr.Name === attrName)?.Value || ''
        
        const id = getAttr('sub')
        const name = getAttr('name')
        const email = getAttr('email')
 
        return new UserCognitoDTO({
            id,
            name, 
            email,
            password: null
        })

    }

    toEntity(): User {

        return new User(
            {
                id: this.id,
                name: this.name,
                email: this.email,
                password: this.password
            }
        )

    }
}
