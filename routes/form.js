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

router.post('/', function (req, res) {
    const date = req.body.Tanggal;
    const id_mesin = req.body.ID_Mesin;
    const id_lot = req.body.ID_Lot;
    const plannedStop = req.body.Planned_Stop;
    const unplannedStop = req.body.Unplanned_Stop;
    const processedAmount = req.body.Processed_Amount;
    const defectAmount = req.body.Defect_Amount;

    var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // password: 'admin',
        user: 'root',
        database: 'oee',
    });

    connection.query('INSERT INTO TBINPUTDATA(Tanggal,ID_Mesin,ID_Lot,Planned_Stop,Unplanned_Stop,Processed_Amount,Defect_Amount)VALUES (' + date + ',' + id_mesin + ',' + id_lot + ',' + plannedStop + ',' + unplannedStop + ',' + processedAmount + ',' + defectAmount + ');', function (error, results, fields) {
        if(error){
            res.send({
                success:false,
                error
            })
        }
        res.send({
            success: true,
            data: results
        })
    });

    connection.end()
})

module.exports = router;
