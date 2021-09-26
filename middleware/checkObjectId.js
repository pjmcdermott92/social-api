const mongoose = require('mongoose');

const checkObjectId = (id) => (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[id])) {
        return res.status(400).json({ success: false, msg: 'Invalid ID'});
    }
    next();
}

module.exports = checkObjectId;
