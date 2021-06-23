const db = require('../config/dbconfig');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();



exports.createUser = async (request, response) => {

    let { userName, email, password } = request.body;


    try {

        //check if user exists

        const userExist = await db.searchByValue(
            {
                table: 'users',
                searchAttribute: 'email',
                searchValue: email,
                attributes: ['*']
            }

        )
        console.log(userExist.data)

        if (userExist.data.length) {
            return response.status(500).json("User with this email id already exists");

        }


        //encrypt password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt)

        const user = await db.insert(
            {
                table: 'users',
                records: [
                    {
                        username: userName,
                        email: email,
                        password: password,

                    }
                ]
            }
        );

        // response.send(user.data.inserted_hashes[0])



 //return jwt

    const payLoad = {
        user: {
            id: user.data.inserted_hashes[0]
        }
        }
        
        jwt.sign(payLoad, process.env.jwtSecret,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) {
                    throw err
                }
                response.json({token})
            
        }
        )




            // (err, res) => {
            //     if (err) response.status(500).json(err);
            //     response.status(200).json(res.data);
            // }

    } catch (err) {
        response.status(500).json('server error')
    }

  

}