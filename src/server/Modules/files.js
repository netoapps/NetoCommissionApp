/**
 * Created by efishtain on 22/07/2016.
 */

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
    fileService.deleteFile(req.params.fileId)
        .then(function(){
            return res.status(200).json({msg:'file deleted'});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        })
}
module.exports = {getAllFiles, deleteFile};