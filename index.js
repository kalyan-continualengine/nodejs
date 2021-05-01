const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
//IMPORT ROUTES
const authRoute = require('./routes/auth');

dotenv.config();

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', function () {
    console.log('MongoDB server connection established successfully!')
})

//MIDDLEWARE
app.use(express.json());
//ROUTER MIDDLEWARE
app.use('/api/user', authRoute);

app.listen(3000, () => console.log('Server is running in port 3000'));