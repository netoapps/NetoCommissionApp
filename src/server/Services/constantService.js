/**
 * Created by efishtain on 22/07/2016.
 */

const commissionType = ["נפרעים","היקף","בונוס"];
const companies = [
    "כלל ביטוח",
    "כלל גמל",
    "מגדל",
    "מנורה",
    "אלטשולר שחם",
    "ילין לפידות",
    "מיטב דש",
    "מיטב דש חדש",
    "הראל",
    "הפניקס",
    "אנליסט",
    "אי בי אי",
    "אקסלנס",
    "הכשרה",
    'אקסלנס IRA',
    'אלטשולר שחם ביטוח',
    'מגדל גמל',
    'מגדל ביטוח',
    'אינפיניטי',
    'וולתסטון',
    'פסגות',
    'מגדל ביטוח ישן ',
    'תמיר פישמן ',
    'מילניום',
    'פניקס ישן',
    'ניהול תיק הראל /בטוחה',
    'אינפינטי',
    "מגדל קשת/ביטוח"];

var Constant = require('../Models/constant');

function ConstantsService(){
    this.init = function()
    {
        companies.forEach(function(c){
            addCompany(c)
        })
        //Constant.update({name:'companies'},{$setOnInsert:{value:companies}},{upsert:true},function(err, n){
        //    if(err){
        //        console.log(err);
        //    }
        //
        //});
        Constant.update({name:'commissionType'},{$setOnInsert:{value:commissionType}},{upsert:true},function(err, n) {
            if (err) {
                console.log(err);
            }
        })
    };

    this.getCommissionTypes = function(){
        return new Promise(function(resolve, reject){
            Constant.findOne({name:'commissionType'}).lean().exec(function(err, ct){
                if(err){
                    return reject(err);
                }
                return resolve(ct.value);
            })
        })
    };

    //this.getCompanyNames = function(){
    //    return new Promise(function(resolve, reject) {
    //        Constant.findOne({name: 'companies'}).lean().exec(function (err, ct) {
    //            if (err) {
    //                return reject(err);
    //            }
    //            return resolve(ct.value);
    //        });
    //    });
    //};

    this.getCompanyNames = function(){
        return new Promise(function(resolve, reject) {
            Constant.find({type:'company'}).lean().exec(function (err, companies) {
                if (err) {
                    return reject(err);
                }
                return resolve(companies)
            });
        });
    };

    this.getCompanyIdByName = function(name){
        return new Promise(function(resolve, reject){
            Constant.findOne({type:'company', name:name}, function(err, company){
                if(err){
                    return reject(err)
                }
                if(!company){
                    return reject('company not found')
                }
                return resolve(company._id)
            })
        })
    }
    //this.addCompany = function(company){
    //    return new Promise(function(resolve, reject) {
    //        Constant.update({name: 'companies'}, {$addToSet: {'value': company}}, function (err, numAffected) {
    //            if (err) {
    //                return reject(err);
    //            }
    //            return resolve();
    //        });
    //    })
    //};

    this.addCompany = addCompany

    //this.removeCompany = function(company){
    //    return new Promise(function(resolve, reject) {
    //        Constant.update({name: 'companies'}, {$pull: {'value': company}}, function (err, numAffected) {
    //            if (err) {
    //                return reject(err);
    //            }
    //            return resolve();
    //        });
    //    })
    //}

    this.removeCompany = function(companyId){
        return new Promise(function(resolve, reject) {
            Constant.remove(companyId, function(err){
                if(err){
                    return reject(err)
                }
                return resolve()
            })
        })
    }

    this.updateCompany = function(companyId, name){
        return new Promise(function(resolve, reject) {
            Constant.update({_id:companyId}, {name:name}, function (err, numAffected) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        })
    }

    //this.updateCompanies = function(companies){
    //    return new Promise(function(resolve, reject) {
    //        Constant.update({name: 'companies'}, {value:companies}, function (err, numAffected) {
    //            if (err) {
    //                return reject(err);
    //            }
    //            return resolve(companies);
    //        });
    //    })
    //}

    //Private functions
    // function init(){
    //     companies.forEach(function(c){
    //         addCompany(c)
    //         console.log(c)
    //     })
    //     //Constant.update({name:'companies'},{$setOnInsert:{value:companies}},{upsert:true},function(err, n){
    //     //    if(err){
    //     //        console.log(err);
    //     //    }
    //     //
    //     //});
    //     Constant.update({name:'commissionType'},{$setOnInsert:{value:commissionType}},{upsert:true},function(err, n) {
    //         if (err) {
    //             console.log(err);
    //         }
    //     })
    // }

    function addCompany(company){
        return new Promise(function(resolve, reject){
            Constant.count({name:company, type:'company'}, function(err, count){
                if(err){
                    return reject(err)
                }
                if(count>0){
                    return resolve('already exist')
                }
                var c = new Constant()
                c.name = company
                c.type = 'company'
                c.save(function(err){
                    if(err){
                        return reject(err)
                    }
                    return resolve(c._id)
                })
            })

        })
    }
}

module.exports = ConstantsService;