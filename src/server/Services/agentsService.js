/**
 * Created by efishtain on 28/05/2016.
 */

var Agent = require('../Models/agent');


function Service() {
    this.addAgent = function (id, name, companyAgentId, companyName) {
        return new Promise(function (resolve, reject) {
            if (!id || !name) {
                return reject('missing id or name');
            }
            name = name.split(' ');
            Agent.create({agentId:id, fullName:name, companyAgentId:companyAgentId,companyName:companyName}, function (err, agent) {
                if (err) {
                    return reject(err);
                }
                return resolve();
            })
        })
    }
}

module.exports = Service;
