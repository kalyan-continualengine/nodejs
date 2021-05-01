const Joi = require('joi');
const express = require("express");
const app = express()

app.use(express.json());

const courses = [
    { "id": 1, "name": 'Test course 1' },
    { "id": 2, "name": 'Test course 2' },
    { "id": 3, "name": 'Test course 3' },
    { "id": 4, "name": 'Test course 4' }
]

//for normal get api call
app.get('/', (req, res) => {
    res.send('hello world');
});

//for different routes
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

//for query params get call and return that param in res
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) { res.status(400).send('The course id not found') };
    res.send(course);
})

//for query param get call and send that query in back
app.get('/api/courses/:year/:month', (req, res) => {
    res.send(req.query);
})

//for post api call sending data
app.post('/api/courses/', (req, res) => {
    // const schema = {
    //     name: Joi.string().min(3).required()
    // };
    // const results = Joi.validate(req.body, schema);
    // console.log(results);

    if (!req.body.name || req.body.name.length > 3) {
        res.status(400).send('Name length should be more than 3')
        return;
    }
    const course = {
        id: courses.length + 1,
        name: req.body.name
    }
    courses.push(course);
    res.send(course);
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Node is running in ${port} port`));