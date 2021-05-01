const router = require('express').Router();

router.post('/register', (req, res) => {
    res.send('register');
})

router.post('/login');

module.exports = router;