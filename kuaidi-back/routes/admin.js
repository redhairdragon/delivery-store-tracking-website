var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


async function checkPassword(req, username, password) {
    try {
        if (result === null)
            return false;
        var authenticated = await bcrypt.compare(password, result.password);
    } catch (e) {
        console.error(e.message);
    }
    if (authenticated === true) {
        console.log("authentication passed checkPassword")
        return true;
    } else {
        console.log("authentication failed checkPassword")
        return false;
    }
}


async function getCookie(username) {
    const option = { header: { "typ": "JWT", "alg": "HS256" } };
    var payload = {
        "exp": Math.floor(Date.now() / 1000) + 2 * (60 * 60),
        "usr": username
    };
    var key = "woshitengshenhaha";
    try {
        var token = await jwt.sign(payload, key, option);
    } catch (e) {
        console.error(e.message);
    }
    return token;
}

/* GET users listing. */
router.post('/login', function(req, res, next) {
    console.log("called")
    res.send('respond with a resource');
});

module.exports = router;