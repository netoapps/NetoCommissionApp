/**
 * Created by efishtain on 19/05/2016.
 */

const SalaryService = require('../Services/salaryService');
const FileService = require('../Services/fileService');
const ExcelService = require('../Services/excelAnalyzerService');

const salaryService = new SalaryService();
const fileService = new FileService();
const analyzer = new ExcelService();

function uploadSalariesFile(req, res) {
    //req.file ={path: 'TestData/tdd.xlsx'};
    if(!req.file){
        return res.status(400).json({err: 'invalid file'});
    }
    var data = req.body;
    //if(!data ||!data.month || !data.year || !data.companyName){
    //    return res.status(400).json({err: 'missing data (month/year/company name)'});
    //}
    data.month=6;
    data.year=2016;
    data.companyName='אפי קורפ';
    fileService.saveFileToDb(req.file,data.month,data.year,data.companyName, function (err, newPath) {
        if (err) {
            return res.status(400).json({err: err});
        }
        analyzer.analyzeSalaryFile(newPath, function (err, salaries) {
            if (err) {
                return res.status(400).json({err: err});
            }
            salaryService.processSalaries(data.month, data.year, data.companyName, salaries, function (err) {
                if (err) {
                    return res.status(400).json(err);
                }
                return res.status(200).json({msg:'all done'});
            });
        });
    });

}

module.exports = {uploadSalariesFile};