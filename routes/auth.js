const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

//FOR SIGNUP API
router.post('/signup', async (req, res) => {

    //validating before adding to db
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if user is already present in database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('User is already exist!!');

    //create new user with postman data and save to db
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    try {
        const saveUser = await user.save();
        res.send(saveUser);
    } catch (err) {
        res.status(400).send('Something went wrong!!')
    }
});

//FOR LOGIN API
router.post('/login', async (req, res) => {
    //validating before adding to db
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking the user email
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Wrong Email!!');

    //checking the user password
    const passwordCheck = await User.findOne({ password: req.body.password });
    if (!passwordCheck) return res.status(400).send('Wrong password!!');

    //create and assigning token
    const token = jwt.sign({ _id: user._id, name: user.name }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

    res.send('Successfully loggedin');
})

module.exports = router;