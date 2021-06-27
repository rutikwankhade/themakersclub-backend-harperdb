const db = require('../config/dbconfig');
const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth')



//add a resource
router.post('/', auth, async (req, res) => {

    let { resourceUrl, resourceCategory } = req.body;

    try {
        
        const user = await db.searchByValue(
            {
                table: 'users',
                searchAttribute: 'id',
                searchValue: req.user.id,
                attributes: ["id", "username"]
            }

        );

        const resource = await db.insert(
            {
                table: 'resources',
                records: [
                    {
                        userName: user.data[0].username,
                        userId: user.data[0].id,
                        url: resourceUrl,
                        category: resourceCategory,
                    }
                ]
            }
        );

        res.send(resource)
    }
    catch (err) {

        res.send(err)

    }

});


module.exports= router;