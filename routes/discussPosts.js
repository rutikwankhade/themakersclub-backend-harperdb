const db = require('../config/dbconfig');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')


//POST api/discuss-posts
//create a post
//access private

router.post('/', auth, async (request, response) => {

    let { postTitle, postText } = request.body;

    try {

        const user = await db.searchByValue(
            {
                table: 'users',
                searchAttribute: 'id',
                searchValue: request.user.id,
                attributes: ["id", "username"]
            }

        )


        const post = await db.insert(
            {
                table: 'discussions',
                records: [
                    {
                        userName: user.data[0].username,
                        userId: user.data[0].id,
                        postTitle: postTitle,
                        postText: postText,
                        replies: []
                    }
                ]
            }
        );

        response.send(post)
    } catch (err) {
        response.send(err)

    }

});



//GET api/discuss-posts
//Get all discussion posts
// access public

router.get('/', async(req, res) => {

    try{
        const posts = await db.searchByValue(
            {
                table: 'discussions',
                searchAttribute: 'id',
                searchValue: '*',
                attributes: ['*']
            }

        )
        res.json(posts)

    } catch (err) {
        res.json(err)

    }
})




module.exports = router;

