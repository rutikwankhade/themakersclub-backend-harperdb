const db = require('../config/dbconfig');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');



//add showcase post
//POST /api/showcase
//access private

router.post('/', auth, async (request, response) => {

    const { showcaseUrl, showcaseText, showcaseTitle } = request.body;

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
                        showcaseTitle: showcaseTitle,
                        showcaseText: showcaseText,
                        feedbacks: []
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

router.get('/', async (req, res) => {

    try {
        const showcasePosts = await db.searchByValue(
            {
                table: 'showcase',
                searchAttribute: 'id',
                searchValue: '*',
                attributes: ['*']
            }

        )
        res.json(showcasePosts)

    } catch (err) {
        res.json(err)

    }
})



//get single showcase post with id
//GET /api/showcase/:id
//access public

router.get('/:id', async (req, res) => {

    try {
        const showcasePost = await db.searchByValue(
            {
                table: 'showcase',
                searchAttribute: 'id',
                searchValue: req.params.id,
                attributes: ['*']
            }

        )
        if (!showcasePost.data.length) {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.json(showcasePost)

    } catch (err) {
        res.json(err)

    }
})



// post feedback to showcaase post
//POST /api/showcase/add-feedback
//access private

router.post('/feedback/:id', auth, async (request, response) => {

    const { feedbackType, feedbackText } = request.body

    try {

        const user = await db.searchByValue(
            {
                table: 'users',
                searchAttribute: 'id',
                searchValue: request.user.id,
                attributes: ["id", "username"]
            }
        )
        // response.send(user)

        let showcasePost = await db.searchByValue(
            {
                table: 'showcase',
                searchAttribute: 'id',
                searchValue: request.params.id,
                attributes: ["*"]
            }
        );

        // response.send(showcasePost)

        const feedback = {
            feedbackType: feedbackType,
            feedbackText: feedbackText,
            userName: user.data[0].username,
            userId: user.data[0].id,
        }

        showcasePost.data[0].feedbacks.unshift(feedback)

        await db.update(
            {
                table: 'showcase',
                records: [
                    {
                        id: showcasePost.data[0].id,
                        feedbacks: showcasePost.data[0].feedbacks

                    }
                ]
            }
        );


        let updatedPost = await db.searchByValue(
            {
                table: 'showcase',
                searchAttribute: 'id',
                searchValue: request.params.id,
                attributes: ["*"]
            }
        );

        response.send(updatedPost)

    } catch (err) {
        response.send(err)
    }

});


module.exports = router;