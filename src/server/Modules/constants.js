/**
 * Created by efishtain on 22/07/2016.
 */

var ConstantsService = require('../Services/constantService');
var constantsService = new ConstantsService();

module.exports.getCommissions = function(req, res){
    constantsService.getCommissionTypes()
        .then(function(ct){
            return res.status(200).json({commissionTypes:ct});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        });

}

module.exports.getCompanies = function(req, res){
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

module.exports.updateCompaniesList = function(req, res){
    if(!req.body.companies || !(Object.prototype.toString.call( req.body.companies ) === '[object Array]' )){
        return res.status(400).json({err:'missing companies list'});
    }
    constantsService.updateCompanies(req.body.companies)
        .then(function(companies){
            return res.status(200).json({companies:companies});
        })
        .catch(function(err){
            return res.status(400).json({err:err});
        });
}