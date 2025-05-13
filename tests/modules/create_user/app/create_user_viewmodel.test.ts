import { User } from "../../../../src/shared/domain/entities/user"
import { CreateUserViewmodel } from "../../../../src/modules/create_user/app/create_user_viewmodel"

describe('Assert Create User viewmodel is correct', () => {
    it('Should return the viewmodel correctly', () => {

        const user = new User({
            id: '5',
            name: 'Yasmin',
            email: 'yasmin@email.com',
            password: 'senhaforte123'
        })

        const viewmodel = new CreateUserViewmodel(user.props).toJSON()

        const expected = JSON.stringify({
            "user": {
                "id": "5",
                "name": "Yasmin",
                "email": "yasmin@email.com",
            }, 
            "message": "The user was created successfully"
        })

        expect(viewmodel).toEqual(expected)

    })
})