const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');
const db = require('../config/dbconfig');

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
    res.send('auth route')
});


module.exports = router;