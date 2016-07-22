/**
 * Created by efishtain on 22/07/2016.
 */

var ConstantsService = require('../Services/constantService');
var constantsService = new ConstantsService();

module.exports.getCompanyNames = function(req, res){
    return res.status(200).json({msg:constantsService.getCompanyNames()})
}

module.exports.getCommisionTypes = function(req, res){
    return res.status(200).json({msg:constantsService.getCommisionTypes()})
}