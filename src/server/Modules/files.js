/**
 * Created by efishtain on 22/07/2016.
 */
var Files = require('../Models/files');
var FileService = require('../Services/fileService');

var fileService = new FileService();

function getAllFiles(req, res){
    fileService.getAllFiles()
        .then(function(files){
            return res.status(200).json({files:files});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        })
}

function deleteFile(req, res){

}
module.exports = {getAllFiles};