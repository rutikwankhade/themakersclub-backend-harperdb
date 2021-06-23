const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/dbconfig');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const bcrypt = require('bcryptjs')


router.get('/', auth, async (req, res) => {

    try {

        const user = await db.searchByValue(
            {
                table: 'users',
                searchAttribute: 'id',
                searchValue: req.user.id,
                attributes: ["id", "email", "username"]
            }

        )

        res.json(user)

    } catch (err) {

        console.log(err);
        res.status(500).send('server error')

    }
});


// login
// POST api/auth
// authenticate user and get token
// access public


router.post('/', async (request, response) => {

    let { email, password } = request.body;


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

        if (!user.data.length) {
            return response.status(500).json("Invalid Credentials");
        }


        const isMatch = await bcrypt.compare(password, user.data[0].password)

        if (!isMatch) {
            return response.status(500).json("Invalid Credentials");

        }

        //return jwt

        const payLoad = {
            user: {
                id: user.data[0].id
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