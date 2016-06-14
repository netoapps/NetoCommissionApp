/**
 * Created by efishtain on 19/05/2016.
 */

var fs = require('fs');
var File = require('../Models/file');
var checksum = require('checksum');
var config = require('../config');
var path = require('path');
function FileService() {
    const dataFilesDirectoryPath = '../../datafiles';
    try {
        fs.accessSync(config.datafilesDirectory, fs.F_OK);
    }catch(err){
        console.log('Creating data files dir for first time');
        fs.mkdirSync(config.datafilesDirectory, 0o666);
    }

    this.saveFileToDb = function (file, month, year, company, cb) {
        checksum.file(file.path, function(err, sum){
            if(err){
                return cb(err);
            }
            File.count({checksum:sum},function(err, count) {
                if (err) {
                    fs.unlink(file.path);
                    return cb(err);
                }
                //if (count > 0) {
                //    fs.unlink(file.path);
                //    return cb('file already exist in db');
                //}
                var newPath = path.join(config.datafilesDirectory, file.filename);
                fs.rename(file.path, newPath, function (err) {
                    var newFile = new File();
                    newFile.orignalFilename = file.originalname;
                    newFile.pathOnDisk = newPath;
                    newFile.processedOn = Date.now();
                    newFile.month = month;
                    newFile.year = year;
                    newFile.companyName = company;
                    newFile.checksum = sum;
                    newFile.save(function(err){
                        if(err){
                            fs.unlink(newPath);
                            return cb(err);
                        }
                        return cb(null,newPath);
                    })
                })
            })
        });


    };
}

module.exports = FileService;