const User = require('../models/User');
const { validateRegistration, validateLogin } = require('../utils/field-validations');
const normalize = require('normalize-url');
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');

const issueJwt = async (res, user) => {
    const payload = {user: { id: user.id }};
    jwt.sign(payload, config.get('JwtSecret'), { expiresIn: 360000 }, (err, token) => {
        if (err) throw err;
        res.json({ success: true, token });
    });
}

module.exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-hash');
        res.json(user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}

module.exports.register = async (req, res) => {
    try {
        const errors = validateRegistration(req.body);
        if (Object.keys(errors).length) return res.status(400).json({ success: false, msg: 'One or more fields is invalid', errors });
        const { firstname, lastname, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ success: false, msg: 'Email is already registered' });
        const avatar = normalize(gravatar.url(email, { s: '200', r: 'pg', d: 'mm' }));
        const hash = await bcrypt.hash(password, 10);
        user = new User({ firstname, lastname, email, avatar, hash });
        await user.save();
        issueJwt(res, user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}

module.exports.authenticate = async (req, res) => {
    try {
        const errors = validateLogin(req.body);
        if (Object.keys(errors).length) return res.status(400).json({ success: false, msg: 'There was an error', errors });
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
        const isMatch = await bcrypt.compare(password, user.hash);
        if (!isMatch) return res.status(400).json({ success: false, msg: 'Invalid Credentials' });
        issueJwt(res, user);
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}
