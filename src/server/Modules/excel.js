/**
 * Created by efishtain on 25/04/2016.
 */

var ExcelAnalyzerService = require('../Services/ExcelAnalyzerService');
var ExcelReportsService = require('../Services/excelReportsService');
var config = require('../config');
var fs = require('fs');
var path = require('path');
var shordid = require('shortid');
var analyzer = new ExcelAnalyzerService();
var reporter = new ExcelReportsService();
module.exports.analyzeColumns = function (req, res) {

    if (!req.file) {
        return res.status(400).json({err: 'missing file'});
    }

    analyzer.analyzeColumns(req.file.path, function (err, result) {
        fs.unlink(req.file.path);
        if (err) {
            return res.status(400).json({err: err});
        }
        return res.status(200).json(result);
    });
}

module.exports.generateAndDownloadSalaryReport = function (req, res) {
    var data = req.body;
    if (!data) {
        return res.status(400).json({err: 'missing report data'});
    }
    var filename = shordid.generate();
    var reportFileStream = fs.createWriteStream(filename);
    reporter.createReport(data.name, data.date, data.salary, data.agencyAmount, data.portfolio, data.incomes, data.expenses, reportFileStream)
        .then(function ()
        {
            return res.download(filename, data.name + '.xlsx', function (err)
            {
                fs.unlink(filename)
            });
        })
        .catch(function (err) {
            fs.unlink(filename)
            return res.status(400).json(err);
        })
}