const express = require('express')
const path = require('path');
const UserLogger = require('../utility/login');

const router = express.Router();

router.post('/login', async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    };

    if (await UserLogger.login(data.username, data.password)) {
        req.session.logged_in = true;
        req.session.username = data.username;
    } else {
        req.session.logged_in = false;
        req.session.username = null;
    }
    res.redirect('/');
});

router.post('/register', async (req, res) => {
    const data = {
        username: req.body.username,
        password: req.body.password
    };

    if (await UserLogger.register(data.username, data.password)) {
        if (await UserLogger.login(data.username, data.password)) {
            req.session.logged_in = true;
            req.session.username = data.username;
            // res.send('Registered and logged in.');
            res.redirect('/');
        } else {
            req.session.logged_in = false;
            req.session.username = null;
            res.send('Registration successful, but login failed');
        }
    } else {
        // Registration failed
        res.send('Registration failed');
    }

});

router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.logged_in = false;
        req.session.username = null;
    }
    res.redirect('/');
});

module.exports = router;