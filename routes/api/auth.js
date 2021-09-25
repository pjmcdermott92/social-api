const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const users = require('../../controllers/users');

//@route    GET /api/auth
//@desc     Find User by ID
//@access   Private
router.get('/', auth, users.getUser);

//@route    POST /api/auth
//@desc     Authenticate User & Issue Token
//@access   Public
router.post('/', users.authenticate);

module.exports = router;
