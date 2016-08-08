/**
 * Created by efishtain on 22/07/2016.
 */

const commissionType = ["נפרעים","היקף","בונוס"];
const companies = ["כלל ביטוח","כלל גמל","מגדל","מנורה","אלטשולר שחם","ילין לפידות","מיטב דש","הראל","הפניקס","אנליסט","איי בי איי","אקסלנס","הכשרה"];
var Constant = require('../Models/constant');

function ConstantsService(){

    init();

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

    this.getCompanyNames = function(){
        return new Promise(function(resolve, reject) {
            Constant.findOne({name: 'companies'}).lean().exec(function (err, ct) {
                if (err) {
                    return reject(err);
                }
                return resolve(ct.value);
            });
        });
    };

    this.addCompany = function(company){
        return new Promise(function(resolve, reject) {
            Constant.update({name: 'companies'}, {$addToSet: {'value': company}}, function (err, numAffected) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        })
    };

    this.removeCompany = function(company){
        return new Promise(function(resolve, reject) {
            Constant.update({name: 'companies'}, {$pull: {'value': company}}, function (err, numAffected) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            });
        })
    }

    //Private functions
    function init(){
        Constant.update({name:'companies'},{$setOnInsert:{value:companies}},{upsert:true},function(err, n){
            if(err){
                console.log(err);
            }

        });
        Constant.update({name:'commissionType'},{$setOnInsert:{value:commissionType}},{upsert:true},function(err, n) {
            if (err) {
                console.log(err);
            }
        })
    }
}

module.exports = ConstantsService;