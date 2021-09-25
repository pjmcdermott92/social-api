const express = require('express');
const router = express.Router();
const users = require('../../controllers/users');

//@route    POST /api/users
//@desc     Register a User & Get a Token
//@access   Public
router.post('/', users.register);

module.exports = router;
