import { User } from "../../../shared/domain/entities/user"

type UserCognitoDTOProps = {
  id: string
  name: string
  email: string
}

type CognitoAttributes = {
    Name: string
    Value: string
}

export class UserCognitoDTO {

    private id: string
    private name: string
    private email: string

    constructor (props: UserCognitoDTOProps) {
        this.id = props.id
        this.name = props.name
        this.email = props.email
    }

    static fromEntity(user: User): UserCognitoDTO {

        return new UserCognitoDTO({
            id: user.id,
            name: user.name,
            email: user.email
        })
    }

    toCognitoAttributes(): CognitoAttributes[] {
        return [
            {
                Name: "User name",
                Value: this.name
            }
        ]
    }

    static fromCognito(userData: any): UserCognitoDTO {

        
        const user_attributes = userData["UserAttributes"] as CognitoAttributes[]
        
        const getAttr = (attrName: string): string => user_attributes.find( (cognitoAttr: CognitoAttributes) => cognitoAttr.Name === attrName)?.Value || ''
        
        const id = getAttr('sub')
        const name = getAttr('name')
        const email = userData["Username"] as string
 
        return new UserCognitoDTO({
            id,
            name, 
            email
        })

    }
}
