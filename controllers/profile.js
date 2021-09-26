const normalize = require('normalize-url');
const { validateProfile, validateExpereince, validateEducation } = require('../utils/field-validations');
const Profile = require('../models/Profile');
const User = require('../models/User');

module.exports.getProfiles = async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['firstname', 'lastname', 'avatar']);
        res.json({ success: true, profiles });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}

module.exports.getProfile = async ({ params: { user_id} }, res) => {
    try {
        const profile = await Profile.findOne({ user: user_id }).populate('user', ['firstname', 'lastname', 'avatar']);
        if (!profile) return res.status(400).json({ success: false, msg: 'Profile not found' });
        return res.json({ success: true, profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}

module.exports.getCurrentProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['firstname', 'lastname', 'avatar']);
        if (!profile) return res.status(400).json({ success: false, msg: 'No Profile exists for this user' });
        res.json({ success: true, profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}

module.exports.createProfile = async (req, res) => {
    const errors = validateProfile(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ success:false, msg: 'Please correct the following errors', errors});
    const { website, skills, youtube, twitter, instagram, facebook, linkedin, ...rest } = req.body;
    const profileFields = {
        user: req.user.id,
        website: website && website !== '' ? normalize(website, { forceHttps: true }) : '',
        skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => ' ' + skill.trim()),
        ...rest
    };
    const socialFields = { youtube, twitter, instagram, facebook, linkedin };
    for (const [key, value] of Object.entries(socialFields)) {
        if (value && value.length > 0) socialFields[key] = normalize(value, { forceHttps: true });
    }
    profileFields.social = socialFields;
    try {
        let profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return res.json({ success: true, msg: 'Profile Updated', profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}

module.exports.deleteProfile = async (req, res) => {
    try {
        const user = req.user.id;
        await Promise.all([
            // @@ REMOVE POSTS ONCE POST ROUTE EXISTS
            Profile.findOneAndRemove({ user }),
            User.findOneAndRemove({ _id: user })
        ]);
        res.json({ success: true, msg: 'User has been permanently deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}

module.exports.addExperience = async (req, res) => {
    const errors = validateExpereince(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ success: false, msg: 'There was an error', errors});
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(req.body);
        await profile.save();
        res.json({ success: true, msg: 'Experience Added', profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}

module.exports.removeExperience = async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        profile.experience = profile.experience.filter(exp => {
            exp._id.toString() !== req.params.exp_id
        });
        await profile.save();
        return res.status(200).json({ success: true, msg: 'Experience Removed', profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}

module.exports.addEducation = async (req, res) => {
    const errors = validateEducation(req.body);
    if (Object.keys(errors).length) return res.status(400).json({ success: false, msg: 'There was an error', errors });
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(req.body);
        await profile.save();
        res.json({ success: true, msg: 'Education Added', profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}

module.exports.removeEducation = async (req, res) => {
    try {
        let profile = await Profile.findOne({ user: req.user.id });
        profile.education = profile.education.filter(edu => {
            edu._id.toString() !== req.params.edu_id
        });
        await profile.save();
        return res.status(200).json({ success: true, msg: 'Education Removed', profile });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, msg: 'There was a Server Error' });
    }
}
