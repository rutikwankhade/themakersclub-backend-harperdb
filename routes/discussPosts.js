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

router.get('/', async (req, res) => {

    try {
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




//GET api/discuss-posts/:id
//Get discussion post by id
// access public

router.get('/:id', async (req, res) => {

    try {
        const post = await db.searchByValue(
            {
                table: 'discussions',
                searchAttribute: 'id',
                searchValue: req.params.id,
                attributes: ['*']
            }

        )
        if (!post.data.length) {
            return res.status(404).json({ msg: 'Post not found' })
        }
        res.json(post)

    } catch (err) {
        res.json(err)

    }
})




//DELETE api/discuss-posts/:id
//delete discussion post by id
// access private

router.delete('/:id', auth, async (req, res) => {

    try {
        const post = await db.searchByValue(
            {
                table: 'discussions',
                searchAttribute: 'id',
                searchValue: req.params.id,
                attributes: ['*']
            }

        );

        // res.json(post)
        //check user
        if (post.data[0].userId.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'user not authorized' })

        }

        if (!post.data.length) {
            return res.status(404).json({ msg: 'Post not found' })
        }


        await db.delete({
            table: 'discussions',
            hashValues: [req.params.id]
        })

        res.json({ msg: 'post removed' })

    } catch (err) {
        res.json(err)

    }
})





//POST api/discuss-posts/comment:id
//create a comment on a post
//access private

router.post('/comment/:id', auth, async (request, response) => {


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

        let post = await db.searchByValue(
            {
                table: 'discussions',
                searchAttribute: 'id',
                searchValue: request.params.id,
                attributes: ["id", "replies"]
            }
        );

        // response.send(post)

        const comment = {
            commentText: request.body.commentText,
            userName: user.data[0].username,
            userId: user.data[0].id,
        }

        post.data[0].replies.unshift(comment)

        const updatedPost = await db.update(
            {
                table: 'discussions',
                records: [
                    {
                        id: post.data[0].id,
                        replies: post.data[0].replies

                    }
                ]
            }
        );

        response.send(updatedPost)

    } catch (err) {
        response.send(err)
    }

});



module.exports = router;

