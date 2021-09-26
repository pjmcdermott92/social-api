const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const posts = require('../../controllers/posts');
const checkObjectId = require('../../middleware/checkObjectId');

//@route    GET api/posts
//@desc     Get all Posts
//@access   Private
router.get('/', auth, posts.getPosts);

//@route    GET api/posts/:id
//@desc     Get a Single Post by ID
//@access   Private
router.get('/:id', auth, checkObjectId('id'), posts.getPost);

//@route    POST api/posts
//@desc     Create a Post
//@access   Private
router.post('/', auth, posts.createPost);

//@route    PUT api/posts/:id
//@desc     Update a Post
//@access   Private
router.put('/:id', auth, checkObjectId('id'), posts.editPost);

//@route    DELETE api/posts/:id
//@desc     Delete a Post by ID
//@access   Private
router.delete('/:id', auth, checkObjectId('id'), posts.removePost);

//@route    PUT api/posts/like/:id
//@desc     Like a Post
//@access   Private
router.put('/like/:id', auth, checkObjectId('id'), posts.likePost);

//@route    PUT api/posts/unlike/:id
//@desc     Like a Post
//@access   Private
router.put('/unlike/:id', auth, checkObjectId('id'), posts.unlikePost);

module.exports = router;
