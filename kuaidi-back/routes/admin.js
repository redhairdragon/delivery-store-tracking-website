var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

let password = "";
var hashedpassword = "$2b$10$VrRXO3pOEhAlFhIlI2ckweErUEXD32tUc8lIFf4Y3sQrNsL6Gvexq";

async function checkPassword(plainpwd) {
    if (plainpwd === undefined)
        return false

    if (plainpwd.length === undefined)
        return false

    var authenticated = await bcrypt.compare(plainpwd, hashedpassword);

    if (authenticated === true) {
        console.log("authentication passed checkPassword")
        password = plainpwd;
        return true;
    } else {
        console.log("authentication failed checkPassword")
        return false;
    }
}

function authenticateCookie(token) {
    if (token === undefined) {
        console.log("token undefined");
        return false;
    }
    try {
        var secretKey = hashedpassword + password;
        var decoded = jwt.verify(token, secretKey);
        return (new Date().getTime() / 1000 < decoded.exp);
    } catch (err) {
        return false;
    }
}

async function getCookie() {
    const option = { header: { "typ": "JWT", "alg": "HS256" } };
    var payload = {
        "exp": Math.floor(Date.now() / 1000) + 7 * (60 * 60),
    };
    var key = hashedpassword + password;
    try {
        var token = jwt.sign(payload, key, option);
    } catch (e) {
        console.error(e.message);
    }
    return token;
}

router.post('/login', async function(req, res, next) {
    if (authenticateCookie(req.cookies.kuaidi)) {
        res.status(200).end()
        return
    }

    try {
        var authenticated = await checkPassword(req.body.password);
        console.log(1)
        if (authenticated === true) {
            var cookie = await getCookie(req.body.password);
            res.cookie("kuaidi", cookie);
            console.log("authentication passed + cookie:" + cookie)
            res.status(200).end()
        } else {
            console.log("authentication failed")
            res.status(401).end()
        }
    } catch (err) {
        console.log(err); // TypeError: failed to fetch
    }
});

router.post('/uploadBatch', async function(req, res, next) {
    if (!authenticateCookie(req.cookies.kuaidi)) {
        res.status(401).end()
        return
    }
    console.log(req.body)
    res.status(200).end()
});






module.exports = router;