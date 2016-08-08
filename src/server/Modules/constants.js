/**
 * Created by efishtain on 22/07/2016.
 */

var ConstantsService = require('../Services/constantService');
var constantsService = new ConstantsService();

module.exports.getCompanyNames = function(req, res){
    constantsService.getCommisionTypes()
        .then(function(ct){
            return res.status(200).json({commissionTypes:ct});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        });

}

module.exports.getCommisionTypes = function(req, res){
    constantsService.getCompanyNames()
        .then(function(ct){
            return res.status(200).json({companies:ct});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        });
}

module.exports.addCompany = function(req, res){
    constantsService.addCompany(req.params.company)
        .then(function(){
            return res.status(200).json({msg:'ok'});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        });
}

module.exports.removeCompany = function(req, res){
    constantsService.removeCompany(req.params.company)
        .then(function(){
            return res.status(200).json({msg:'ok'});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        });
}