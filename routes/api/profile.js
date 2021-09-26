const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkObjectId = require('../../middleware/checkObjectId');
const profile = require('../../controllers/profile');

//@route    GET api/profile/me
//@desc     Get current user's profile
//@access   Public
router.get('/', profile.getProfiles);

//@route    GET api/profile/user/:user_id
//@desc     Get a single profile by user id
//@access   Public
router.get('/user/:user_id', checkObjectId('user_id'), profile.getProfile);

//@route    GET api/profile/me
//@desc     Get current user's profile
//@access   Private
router.get('/me', auth, profile.getCurrentProfile);

//@route    POST api/profile
//@desc     Create or Update User Profile
//@access   Private
router.post('/', auth, profile.createProfile);

//@route    DELETE /api/profile
//@desc     Delete a Profile, Posts & User
//@access   Private
router.delete('/', auth, profile.deleteProfile);

//@route    PUT api/profile/experience
//@desc     Add or modify Profile Experience
//@access   Private
router.put('/experience', auth, profile.addExperience);

//@route    DELETE api/profile/experience/:exp_id
//@desc     Delete User Experience
//@access   Private
router.delete('/experience/:exp_id', auth, profile.removeExperience);

//@route    PUT api/profile/education
//@desc     Add or modify Profile Education
//@access   Private
router.put('/education', auth, profile.addEducation);

//@route    DELETE api/profile/education/:edu_id
//@desc     Delete User Profile Education
//@access   Private
router.delete('/education/:edu_id', auth, profile.removeEducation);

module.exports = router;
