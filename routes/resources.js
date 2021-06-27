const db = require('../config/dbconfig');
const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth')



//add a resource
router.post('/', auth, async (req, res) => {

    let { resourceUrl, resourceCategory } = req.body;

    try {

         const resourceExist = await db.searchByValue(
            {
                table: 'resources',
                searchAttribute: 'url',
                searchValue: resourceUrl,
                attributes: ['*']
            }

        )

        if (resourceExist.data.length) {
            return res.status(500).send({ error: "This resource already exists in our database" });
        }
        
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


//get all resources

router.get('/', async (req, res) => {
    
    try {
     const resources = await db.searchByValue(
            {
                table: 'resources',
                searchAttribute: 'id',
                searchValue: "*",
                attributes: ["*"]
            }

        );

        res.json(resources)
    }
    catch (err) {
        res.send(err);
    }
})


module.exports= router;