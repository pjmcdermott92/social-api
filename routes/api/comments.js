const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const comments = require('../../controllers/comments');

//@route    POST api/posts/comment/:id
//@desc     Comment on a Post
//@access   Private
router.post('/:id', auth, checkObjectId('id'), comments.postComment);

//@route    PUT api/posts/comment/:id/:comment_id
//@desc     Edit a Comment
//@access   Private
router.put('/:id/:comment_id', auth, checkObjectId('id'), comments.editComment);

//@route    DELETE api/posts/comment/:id/:comment_id
//@desc     Delete a Comment
//@access   Private
router.delete('/:id/:comment_id', auth, comments.removeComment);

//@route    PUT api/posts/comment/like/:id/:comment_id
//@desc     Like a Comment
//@access   Private
router.put('/like/:id/:comment_id', auth, checkObjectId('id'), comments.likeComment);

//@route    PUT api/posts/comment/like/:id/:comment_id
//@desc     Like a Comment
//@access   Private
router.put('/unlike/:id/:comment_id', auth, checkObjectId('id'), comments.unlikeComment);


module.exports = router;
