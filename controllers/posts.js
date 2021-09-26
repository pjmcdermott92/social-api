const { validateComment } = require('../utils/field-validations');
const Post = require('../models/Post');
const User = require('../models/User');

module.exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json({ success: true, posts });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}

module.exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, msg: 'Post Not Found' });
        return res.json({ success: true, post });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}

module.exports.createPost = async (req, res) => {
    const errors = validateComment(req.body);
    if (errors) return res.status(400).json({ success: false, msg: 'There was an error', errors });
    try {
        const user = await User.findById(req.user.id).select('-hash');
        const newPost = new Post({
            user: req.user.id,
            firstname: user.firstname,
            avatar: user.avatar,
            text: req.body.text
        });
        const post = await newPost.save();
        return res.json({ success: true, msg: 'Post created', post });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}

module.exports.editPost = async (req, res) => {
    const errors = validateComment(req.body);
    if (errors) return res.status(400).json({ success: false, msg: 'There was an error', errors });
    try {
        let post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, msg: 'Post Not Found' });
        if (post.user.toString() !== req.user.id) return res.status(401).json({ success: false, msg: 'Access denied. User not authorized' });
        post.text = req.body.text;
        await post.save();
        return res.json({ success: true, msg: 'Post Updated', post });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}

module.exports.removePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ success: false, msg: 'Post Not Found' });
        if (post.user.toString() !== req.user.id) return res.status(401).json({ success: false, msg: 'Access denied. User not authorized' });
        await post.remove();
        return res.json({ success: true, msg: 'Post Deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}

module.exports.likePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (post.likes.some(like => like.user.toString() === req.user.id)) {
            return res.status(400).json({ success: false, msg: 'Post already liked' });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        return res.json({ success: true, msg: 'Post Liked', likes: post.likes });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}

module.exports.unlikePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        if (!post.likes.some(like => like.user.toString() === req.user.id)) {
            return res.status(400).json({ success: false, msg: 'Post has not yet been liked' });
        }
        post.likes = post.likes.filter(({ user }) => user.toString() !== req.user.id);
        await post.save();
        return res.json({ success: true, msg: 'Post Unliked', likes: post.likes });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'A Server Error occured' });
    }
}
