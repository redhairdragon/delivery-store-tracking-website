var express = require('express');
var router = express.Router();

router.get('/packageInfo', async function (req, res, next) {
    let dbConn = req.app.get("mysqlConn");
    const batchQuery = "select batchName,transferCompany, transferPackageId from Batch INNER JOIN Package ON Batch.packageId = Package.packageId where Batch.packageId= ?;";
    let packageId = req.query.packageId;
    dbConn.query(batchQuery, [req.query.packageId], function (error, results, fields) {
        if (error) {
            res.status(500).end();
            return;
        }
        if (results.length == 0) {
            res.status(404).end();
            return;
        }
        let transferCompany = results[0].transferCompany;
        let transferPackageId = results[0].transferPackageId;
        const statesQuery = "select description,updated from States where batchName = ?;";
        dbConn.query(statesQuery, [results[0].batchName], function (error, results, fields) {
            if (error) {
                res.status(500).end();
                return;
            }
            console.log(results);
            let states = {};
            results.forEach(function (result) {
                states[result.description] = result.updated;
            });
            let response = {};
            response["states"] = states;
            response["transfer"] = {
                "转运公司": transferCompany,
                "转运单号": transferPackageId
            };
            console.log(response);
            res.status(200).send(response).end();
        });
    });
});

router.get('/getPrice', async function (req, res, next) {
    const file = `./price.pdf`;
    res.download(file);
});
module.exports = router;
