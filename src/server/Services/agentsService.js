/**
 * Created by efishtain on 28/05/2016.
 */

var Agent = require('../Models/agent');
var Partnership = require('../Models/partnership');

var shortid = require('shortid');

function Service() {

    this.clearAgentsAndPartnerships = function(cb){
        Agent.remove({},function(err){
            if(err){
                return cb(err)
            }
            Partnership.remove({},function(err){
                if(err){
                    return cb(err)
                }
                return cb()
            })
        })
    }

    this.createBasicAgent = function(id, name, familyName, cb){
        Agent.count({idNumber:id}, function(err, count){
            if(err){
                return cb(err)
            }
            if(count!==0){
                return cb(id+' already exists')
            }
            var agent = new Agent();
            agent.idNumber = id
            agent.name = name
            agent.familyName = familyName
            agent.deleted = false
            agent.paymentDetails = []
            agent.save(function(err){
                if(err) {
                    return cb(err)
                }
                return cb()
            })
        })
    }

    this.addAgentPaymentDetails = function(id, pd, cb){
        Agent.update({idNumber:id},{'$addToSet':{paymentsDetails:{'$each':pd}}}, function(err, numAffected){
            if(err){
                return cb(err)
            }
            if(numAffected.n===0){
                return cb('agent not found: '+id)
            }
            return cb()
        })
    }

    this.addPartnershipDetails = function(agentsDetails, active, paymentsDetails, hash, cb){

        Partnership.count({agentsIdsSha1:hash}, function(err, count){
            if(err){
                return cb(err)
            }
            if(count===0){
                var partnership = new Partnership();
                partnership.agentsDetails = agentsDetails;
                partnership.active = active;
                partnership.paymentsDetails = paymentsDetails;
                partnership.agentsIdsSha1 = hash;
                partnership.save(function(err){
                    if(err){
                        return cb(err);
                    }
                    return cb();
                })
            }else{
                Partnership.update({agentsIdsSha1:hash},{'$addToSet':{paymentsDetails:{'$each':paymentsDetails}}}, function(err, numAffected){
                    if(err){
                        return cb(err)
                    }
                    if(numAffected.n===0){
                        return cb('partnership not found: '+hash)
                    }
                    return cb()
                })
            }
        })


    };


    this.addAgent = function (id, name, familyName, phoneNumber, faxNumber, email, active, paymentDetails) {
        return new Promise(function (resolve, reject) {
            if (!id || !name) {
                return reject('missing id or name');
            }

            Agent.findOneAndUpdate(
                {idNumber: id},
                {
                    name: name,
                    familyName:familyName,
                    phoneNumber:phoneNumber,
                    faxNumber:faxNumber,
                    email:email,
                    active:active,
                    deleted:false,
                    $pushAll: {
                        paymentsDetails: paymentDetails
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

