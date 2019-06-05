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
    connection.connect();

    connection.query('select * from tbmesin', function (error, results, fields) {
        if (error) throw error;
        res.send({
            success: true,
            data:data
        })
    });

    connection.end();   
});

module.exports = router;
