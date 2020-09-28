var express = require('express');
var router = express.Router();

router.get('/packageInfo', async function (req, res, next) {
    let dbConn = req.app.get("mysqlConn")
    const batchQuery = "select batchName from Batch where packageId = ?;";
    let packageId = req.query.packageId;
    dbConn.query(batchQuery, [req.query.packageId], function (error, results, fields) {
        if (error) {
            res.status(500).end()
            return
        }
        if (results.length == 0) {
            res.status(404).end()
            return
        }
        console.log(results)
        console.log(results[0].batchName)
        const statesQuery = "select description,updated from States where batchName = ?;";
        dbConn.query(statesQuery, [results[0].batchName], function (error, results, fields) {
            if (error) {
                res.status(500).end()
                return
            }
            console.log(results)
            let states = {}
            results.forEach(function(result){
                states[result.description]=result.updated
            })
            res.status(200).send(states).end()
        });
    })
})
module.exports = router;
