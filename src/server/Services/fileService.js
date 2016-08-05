/**
 * Created by efishtain on 19/05/2016.
 */

var fs = require('fs');
var File = require('../Models/file');
var checksum = require('checksum');
var config = require('../config');
var path = require('path');

var SalaryService = require('./salaryService');
var salaryService = new SalaryService();
function FileService() {
    const dataFilesDirectoryPath = '../../datafiles';
    try {
        fs.accessSync(config.datafilesDirectory, fs.F_OK);
    }catch(err){
        console.log('Creating data files dir for first time');
        fs.mkdirSync(config.datafilesDirectory, 0o777);
    }

    this.getAllFiles = function(){
        return new Promise(function(resolve, reject){
            File.find({}, function(err, files){
                if(err){
                    return reject(err);
                }
                return resolve(files);
            })
        })
    }

    this.deleteFile = function(fileId){
        return new Promise(function(resolve, reject){
           File.findById(fileId, function(err, file){
               if(err){
                   return reject(err);
               }
               if(!file){
                   return reject('file not found');
               }
               try {
                   fs.unlinkSync(file.pathOnDisk);
                   salaryService.removeSalariesByFileId(file._id)
                       .then(function(){
                           file.remove(function(err){
                               if(err){
                                   return reject(err);
                               }
                               return resolve();
                           })
                       })
                       .catch(function(err){
                           return reject('failed deleting old salaries:' +err);
                       })

               }catch(err){
                   return reject(err);
               }
           })
        });
    }

    this.saveFileToDb = function (file, fileData, cb) {
        checksum.file(file.path, function(err, sum){
            if(err){
                return cb(err);
            }
            File.count({checksum:sum},function(err, count) {
                if (err) {
                    fs.unlink(file.path);
                    return cb(err);
                }
                if (count > 0) {
                    fs.unlink(file.path);
                    return cb('file already exist in db');
                }
                var newPath = path.join(config.datafilesDirectory, file.filename);
                fs.rename(file.path, newPath, function (err) {
                    var newFile = new File();
                    newFile.pathOnDisk =    newPath;
                    newFile.name =          file.originalname;
                    newFile.paymentDate =   fileData.paymentDate;
                    newFile.uploadDate =    Date.now();
                    newFile.company =       fileData.company;
                    newFile.note =          fileData.note;
                    newFile.taxState =      fileData.taxState;
                    newFile.taxValue =      fileData.taxValue;
                    newFile.checksum =      sum;
                    newFile.save(function(err){
                        if(err){
                            fs.unlink(newPath);
                            return cb(err);
                        }
                        return cb(null,newFile);
                    })
                })
            })
        });


    };
}

module.exports = FileService;