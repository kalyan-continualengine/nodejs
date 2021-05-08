'use strict';
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');

// //IMPORT API ROUTES
// const authRoute = require('../routes/auth');
// const postsRoute = require('../routes/posts');

const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');


dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log('MongoDB server connection established successfully!')
})

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


router.get('/posts', (req, res) => {
    res.json({
        "posts": {
            "title": 'My First Post',
            "description": 'Random posts'
        }
    })
});


//MIDDLEWARE
app.use(express.json());
app.use('/.netlify/functions/index', router);  // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
//ROUTER MIDDLEWARE
// app.use('/.netlify/functions/api/user', authRoute);
// app.use('/.netlify/functions/api/posts', postsRoute);

module.exports = app;
module.exports.handler = serverless(app);

//app.listen(3000, () => console.log('Server is running in port 3000'));