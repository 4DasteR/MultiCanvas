const express = require('express')
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.logged_in) {
        req.session.logged_in = false;
        req.session.username = null;
    }

    const opts = {
        logged_in: req.session.logged_in,
        username: req.session.username
    };

    res.render(path.resolve(__dirname, '../views/main.ejs'), opts);
});

module.exports = router;