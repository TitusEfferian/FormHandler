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
    connection.query(`SELECT
        tbinputdata.Tanggal, tbinputdata.ID_Mesin,
        tbmesin.Jenis_Mesin, tbmesin.Nomor_Mesin,
        tbmaterial.Nama_Material, tbmaterial.NE,
        tbmesin.Ideal_CT, tbmesin.Delivery,
        tbinputdata.ID_Lot, tbinputdata.Planned_Stop, tbinputdata.Unplanned_Stop, tbinputdata.Processed_Amount, tbinputdata.Defect_Amount,
        (1440-Planned_Stop) AS Loading_Time,
        ((1440-Planned_Stop)-Unplanned_Stop) AS Operation_Time,
        ROUND((((1440-Planned_Stop)-Unplanned_Stop)/(1440-Planned_Stop)),4) AS AvailabilityRate,
        ROUND(((Processed_Amount*1000*1.693*NE)/(Ideal_CT*((1440-Planned_Stop)-Unplanned_Stop)*Delivery)),4) AS PerformanceRate,
        ROUND(((Processed_Amount-Defect_Amount)/Processed_Amount),4) AS QualityRate,
        ROUND(((((1440-Planned_Stop)-Unplanned_Stop)/(1440-Planned_Stop)) * ((Processed_Amount*1000*1.693*NE)/(Ideal_CT*((1440-Planned_Stop)-Unplanned_Stop)*Delivery)) * ((Processed_Amount-Defect_Amount)/Processed_Amount)),4) AS OEERate
        
        FROM tbinputdata, tbmesin, tbmaterial
        
        WHERE tbinputdata.ID_Mesin=tbmesin.ID_Mesin AND tbinputdata.ID_Lot=tbmaterial.ID_Lot`, function (error, results, fields) {
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
