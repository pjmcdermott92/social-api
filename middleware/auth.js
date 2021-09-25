const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ success: false, msg: 'Access Denied, No Auth Token' });
    try {
        jwt.verify(token, config.get('JwtSecret'), (error, decoded) => {
            if (error) return res.status(401).json({ success: false, msg: 'Access Denied, Invalid Auth Token' });
            else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        console.log('Auth Middleware Error');
        res.status(500).json({ success: false, msg: 'Server Error' });
    }
}