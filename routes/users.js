const db = require('../config/dbconfig');
const bcrypt = require('bcryptjs')


exports.createUser = async (request, response) => {


    let { userName, email, password } = request.body;


    try {

        //check if user exists

        const user = await db.searchByValue(
            {
                table: 'users',
                searchAttribute: 'email',
                searchValue: email,
                attributes: ['*']
            }

        )
        console.log(user.data)

        if (user.data.length) {
            return response.status(500).json("User with this email id already exists");

        }


        //encrypt password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt)

        await db.insert(
            {
                table: 'users',
                records: [
                    {
                        username: userName,
                        email: email,
                        password: password,

                    }
                ]
            },
            (err, res) => {
                if (err) response.status(500).json(err);
                response.status(200).json(res.data);
            }
        );


    } catch (err) {
        response.status(500).json('server error')
    }




    //return jwt



}