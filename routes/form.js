var express = require('express');
var router = express.Router();
var mysql = require('mysql');

router.get('/', function (req, res, next) {
    var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // password: 'admin',
        user: 'root',
        database: 'oee',
    });
    connection.query('select * from tbmesin', function (error, results, fields) {
        if (error) throw error;
        res.send({
            success: true,
            data: results
        })
    });
    connection.end()
});

module.exports = router;
