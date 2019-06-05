var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // password: 'admin',
    user: 'root',
    database: 'oee',
});

router.get('/', function (req, res, next) {
    let data;
    connection.connect();

    connection.query('select * from dbmesin', function (error, results, fields) {
        if (error) throw error;
        data=results
    });

    connection.end();

    res.send({
        success: true,
        data:data
    })
});

module.exports = router;
