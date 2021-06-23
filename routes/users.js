const db = require('../config/dbconfig');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config();
const express = require('express');
const router = express.Router();


router.post('/', async (request, response) => {

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

        //add user to database

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
                response.json({ token })

            }
        )


    } catch (err) {
        response.status(500).json('server error')
    }


})


module.exports = router;
