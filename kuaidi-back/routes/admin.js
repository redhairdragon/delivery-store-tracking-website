var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
const { pid } = require('process');

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

router.get('/batchNameCheck', async function(req, res, next) {
    if (!authenticateCookie(req.cookies.kuaidi)) {
        res.status(401).end()
        return
    }
    let query = "select 1 from Batch where batchName = ? limit 1;";
    let batchName = req.query.batchName;
    let dbConn = req.app.get("mysqlConn")

    await dbConn.query(query, [batchName], function(error, results, fields) {
        console.log(results)
        if (error) {
            res.status(400).send("db update fail").end()
            return
        }
        if (results.length == 0)
            res.status(200).send(false).end()
        else
            res.status(200).send(true).end()
        return
    })
});

// 如果package存在，会被更新 TABLE:Batch Package
// 如果batchName存在，会删除旧的batch里的所有东西 TABLE:Batch Package
router.post('/uploadBatch', async function(req, res, next) {
    if (!authenticateCookie(req.cookies.kuaidi)) {
        res.status(401).end()
        return
    }
    let data = req.body.data
    let batchName = req.body.batchName;
    if (!batchName) {
        res.status(422).send("batch name is not received").end()
        return
    }

    if (!req.body.data) {
        res.status(422).send("table data is not received").end()
        return
    }

    if (batchName.length > 40) {
        res.status(422).send("batch name too long").end()
        return
    }
    const categories = ['seq', 'packageId', 'channel', 'customerName', 'customerPhone', 'brandName', 'brandNameChinese', 'quantity', 'unitPrice', 'dimension', 'unit', 'weight', 'insuredAmount', 'insuranceFee', 'customTax', 'receiverName', 'receiverPhone', 'receiverProvince', 'receiverCity', 'receiverAddress', 'receiverZIP', 'receiverId', 'transferCompany', 'transferPackageId', 'created', 'SKU', 'comment']
    for (let i = 1; i < data.length; ++i) {
        if (data[i].length > categories.length) {
            res.status(422).send("too many items on row " + i).end()
            return
        }
    }

    let dbConn = req.app.get("mysqlConn")
    deleteBatch(batchName, dbConn)
        //add packages into Package table
    for (let i = 1; i < data.length; ++i) {
        let fields = []
        let values = []
        for (let j = 0; j < data[i].length; ++j) {
            if (data[i][j] !== null) {
                fields.push(categories[j])
                if (categories[j] == 'created') {
                    if (Date.parse(data[i][j]) === NaN) {
                        res.status(422).send("invalid timestamp").end();
                        return;
                    }
                    let date = new Date(data[i][j]).toISOString().slice(0, 19).replace('T', ' ');
                    values.push(dbConn.escape(date))
                } else
                    values.push(dbConn.escape(data[i][j]))
            }
        }
        if (fields.length > 0) {
            let query = "replace into Package (" +
                fields.join() + ")" +
                " VALUES (" +
                values.join() +
                ")"
            dbConn.query(query, function(error, results, fields) {
                if (error) {
                    res.status(400).send("db update fail").end()
                    return
                }
            });
        }
    }

    let batchCreateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    //add batchInfo to Batch table
    for (let i = 1; i < data.length; ++i) {
        const query = "replace into Batch (batchName, packageId, created) VALUES (?, ?, ?)";
        dbConn.query(query, [batchName, data[i][1], batchCreateTime], function(error, results, fields) {
            if (error) {
                res.status(400).send("db update fail").end()
                return
            }
        })
    }
    res.status(200).end()
});

function deleteBatch(batchName, dbConn) {
    let deletePackageQuery =
        "delete from Package where packageId in ( select packageId from Batch where batchName = ?);"
    dbConn.query(deletePackageQuery, [batchName], function(error, results, fields) {});

    let deleteBatchQuery = "DELETE FROM Batch WHERE batchName=?";
    dbConn.query(deleteBatchQuery, [batchName], function(error, results, fields) {})
}


router.get('/batchList', async function(req, res, next) {
    if (!authenticateCookie(req.cookies.kuaidi)) {
        res.status(401).end()
        return
    }
    let dbConn = req.app.get("mysqlConn")
    let query = "select distinct batchName from Batch;";
    let batches = []
    dbConn.query(query, [], function(error, results, fields) {
        results.forEach(result => {
            batches.push(result.batchName)
        })
        res.status(200).send(batches).end()
    });
})

function checkBatchNameExistance(batchName, dbConn, callback) {
    if (!batchName)
        return false
    let query = "select 1 from Batch where batchName = ? limit 1;";
    dbConn.query(query, [batchName], function(error, results, fields) {
        callback(error, results)
    });
}


router.post('/updateBatchStates', async function(req, res, next) {
    if (!authenticateCookie(req.cookies.kuaidi)) {
        res.status(401).end()
        return
    }
    let payload = req.body.payload
    if (!payload.batchName) {
        res.status(402).send("缺少batch name,不该出现,联系申").end()
        return
    }
    if (payload.states.length != payload.times.length) {
        res.status(402).send("时间和状态长度不一致,不该出现,联系申").end()
        return
    }

    let dbConn = req.app.get("mysqlConn")
    checkBatchNameExistance(payload.batchName, dbConn, (error, results) => {
        if (error) {
            res.status(500).send("数据库坏了,联系申").end()
            return
        }
        if (results.length == 0) {
            res.status(402).send("Logging: 使用前端的话不该出现，有人在调用API，提高警戒").end()
            return
        } else {
            let query = "replace into States (batchName, description,updated) VALUES ";
            let params = []
            for (let i = 0; i < payload.states.length; i++) {
                query += "(?,?,?),"
                params.push(payload.batchName)
                params.push(payload.states[i])
                params.push(payload.times[i])
            }
            dbConn.query(query.substr(0, query.length - 1), params, function(error, results) {
                if (error) {
                    res.status(500).end();
                    return;
                }
                res.status(200).end();
                return;
            });
        }
    })
})
module.exports = router;