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

    const firstDate = req.query.firstDate;
    const lastDate = req.query.lastDate;
    const machineType = req.query.machineType;
    console.log('firstDate:'+firstDate+', lastDate:'+lastDate)
    connection.query(`SELECT

    Tanggal,
    Jenis_Mesin,
    
    ROUND(AVG(AvailabilityRate),4) AS Mean_AvailabilityRate,
    ROUND(AVG(PerformanceRate),4) AS Mean_PerformanceRate,
    ROUND(AVG(QualityRate),4) AS Mean_QualityRate,
    ROUND(AVG(OEERate),4) AS Mean_OEERate
    
    FROM tboee
    
    WHERE
    Jenis_Mesin="`+machineType+`" AND (Tanggal BETWEEN '`+firstDate+`' AND '`+lastDate+`')
    
    GROUP BY Tanggal
    
    ORDER BY Tanggal ASC;`, function (error, results, fields) {
            if (error) {
                res.send({
                    success: false,
                    error
                })
            }
            else {
                res.send({
                    success: true,
                    data: results
                })
            }

        });
    connection.end()
});

router.post('/', function (req, res) {
    const date = req.body.Tanggal;
    const id_mesin = req.body.ID_Mesin;
    const id_lot = req.body.ID_Lot;
    const plannedStop = parseInt(req.body.Planned_Stop);
    const unplannedStop = parseInt(req.body.Unplanned_Stop);
    const processedAmount = parseFloat(req.body.Processed_Amount);
    const defectAmount = parseFloat(req.body.Defect_Amount);

    var connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,
        // password: 'admin',
        user: 'root',
        database: 'oee',
    });

    connection.query('INSERT INTO TBINPUTDATA(Tanggal,ID_Mesin,ID_Lot,Planned_Stop,Unplanned_Stop,Processed_Amount,Defect_Amount)VALUES ("' + date + '","' + id_mesin + '","' + id_lot + '",' + plannedStop + ',' + unplannedStop + ',' + processedAmount + ',' + defectAmount + ');', function (error, results, fields) {
        if (error) {
            res.send({
                success: false,
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
