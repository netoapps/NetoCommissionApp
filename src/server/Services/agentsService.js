/**
 * Created by efishtain on 28/05/2016.
 */

var Agent = require('../Models/agent');
var Partnership = require('../Models/partnership');

var shortid = require('shortid');

function Service() {
    this.addAgent = function (id, name, familyName, phoneNumber, faxNumber, email, active, agentNumber, companyName) {
        return new Promise(function (resolve, reject) {
            if (!id || !name) {
                return reject('missing id or name');
            }
            name = name.split(' ');
            Agent.update(
                {idNumber: id},
                {
                    name: name,
                    familyName:familyName,
                    phoneNumber:phoneNumber,
                    faxNumber:faxNumber,
                    email:email,
                    active:active,
                    $push: {
                        paymentsDetails: {
                            companyName: companyName,
                            agentNumber: agentNumber,
                            paymentType: '3',
                            agentPart: '80'
                        }
                    },
                    $setOnInsert: {_id: shortid.generate()}
                },
                {upsert: true},
                function (err, numAffected) {
                    if (err) {
                        return reject(err);
                    }
                    return resolve();
                });
        })
    };

    this.addPartnership = function(agentsDetails, active, paymentsDetails){
        return new Promise(function(resolve, reject){
           var partnership = new Partnership();
            partnership.agentsDetails = agentsDetails;
            partnership.active = active;
            partnership.paymentsDetails = paymentsDetails;
            partnership.save(function(err){
                if(err){
                    return reject(err);
                }
                return resolve();
            })
        });
    };

    //Queries
    this.getAllAgents = function(){
        return new Promise(function(resolve, reject){
            Agent.find({}).lean().exec(function(err,agents){
                if(err){
                    return reject(err);
                }
                return resolve(agents);
            });
        })
    };

    this.getAllPartnerships = function(){
        return new Promise(function(resolve, reject){
            Partnership.find({},function(err,agents){
                if(err){
                    return reject(err);
                }
                return resolve(agents);
            });
        })
    };
}

module.exports = Service;

