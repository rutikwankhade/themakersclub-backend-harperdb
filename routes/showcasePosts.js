const db = require('../config/dbconfig');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');



//add showcase post
//POST /api/showcase
//access private

router.post('/', auth, async (request, response) => {

    const { showcaseUrl, showcaseText } = request.body;

    try {
        const user = await db.searchByValue(
            {
                table: 'users',
                searchAttribute: 'id',
                searchValue: request.user.id,
                attributes: ["id", "username"]
            }

        );


         const showcasePost = await db.insert(
            {
                table: 'showcase',
                records: [
                    {
                        userName: user.data[0].username,
                        userId: user.data[0].id,
                        showcaseUrl: showcaseUrl,
                        showcaseText: showcaseText,
                    }
                ]
            }
        );

        response.send(showcasePost)



    } catch (err) {
        response.send(err)
    }
})




//get all showcase posts
//GET /api/showcase
//access public




//get single showcase post with id
//GET /api/showcase/:id
//access public






// post feedback to showcaase post
//POST /api/showcase/add-feedback
//access private



module.exports = router;