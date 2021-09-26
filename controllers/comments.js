const { validateComment } = require('../utils/field-validations');
const Post = require('../models/Post');
const User = require('../models/User');

module.exports.postComment = async (req, res) => {
    const errors = validateComment(req.body);
    if (errors) return res.status(400).json({ success: false, msg: 'There was an error', errors });
    try {
        let user = await User.findById(req.user.id);
        let post = await Post.findById(req.params.id);
        const newComment = {
            user: req.user.id,
            firstname: user.firstname,
            avatar: user.avatar,
            text: req.body.text
        };
        post.comments.unshift(newComment);
        await post.save();
        return res.json({ success: true, comments: post.comments });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}

module.exports.editComment = async (req, res) => {
    const errors = validateComment(req.body);
    if (errors) return res.status(400).json({ success: false, msg: 'There was an error', errors });
    try {
        let post = await Post.findById(req.params.id);
        let commentIndex = post.comments.findIndex(({ id }) => id.toString() === req.params.comment_id);
        if (post.comments[commentIndex].user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, msg: 'Access denied. User not authorized' }); 
        };
        post.comments[commentIndex].text = req.body.text;
        await post.save();
        res.json({ cussess: true, msg: 'Comment Updated', comments: post.comments });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}

module.exports.removeComment = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        let comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if (!comment) return res.status(400).json({ success: false, msg: 'Comment Not Found'});
        if (comment.user.toString() !== req.user.id) return res.status(401).json({ success: false, msg: 'Access denied. User not authorized' });
        post.comments = post.comments.filter(({ id }) => id.toString() !== req.params.comment_id);
        await post.save();
        return res.json({ success: true, msg: 'Comment Deleted', comments: post.comments});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}

module.exports.likeComment = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        let commentIndex = post.comments.findIndex(({ id }) => id.toString() === req.params.comment_id);
        if (post.comments[commentIndex].likes.some(like => like.user.toString() === req.user.id)) {
            return res.status(400).json({ success: false, msg: 'Comment already liked' });
        }
        post.comments[commentIndex].likes.unshift({ user: req.user.id });
        await post.save();
        return res.json({ success: true, msg: 'Comment Liked', likes: post.comments.likes});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}

module.exports.unlikeComment = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        let commentIndex = post.comments.findIndex(({ id }) => id.toString() === req.params.comment_id);
        if (!post.comments[commentIndex].likes.some(like => like.user.toString() === req.user.id)) {
            return res.status(400).json({ success: false, msg: 'Comment has not yet been liked' });
        }
        post.comments[commentIndex].likes = post.comments[commentIndex].likes.filter(({ user }) => user.toString() !== req.user.id);
        await post.save();
        return res.json({ success: true, msg: 'Comment Unliked', likes: post.comments.likes});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}
