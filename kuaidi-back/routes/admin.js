var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');


async function checkPassword(plainpwd) {
    var password = "$2b$10$VrRXO3pOEhAlFhIlI2ckweErUEXD32tUc8lIFf4Y3sQrNsL6Gvexq";
    var authenticated = await bcrypt.compare(plainpwd, password);

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
router.post('/login', async function(req, res, next) {

    var authenticated = await checkPassword(req.body.password);
    if (authenticated === true) {
        var cookie = await getCookie();
        // res.cookie("jwt", cookie);
        console.log("authentication passed")
        res.status(200).end()
    } else {
        console.log("authentication failed")
        res.status(401).end()
    }
});

module.exports = router;