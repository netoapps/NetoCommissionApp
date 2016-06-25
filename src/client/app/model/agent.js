/**
 * Created by asaf on 25/06/16.
 */

export class AgentPaymentDetails {

    constructor(agentPaymentDetails) {
        if(arguments.length > 0)
        {
            this.copyFrom(agentPaymentDetails)
        }
        else
        {
            this.companyName = "";
            this.agentNumber = "";
            this.paymentType = "";
            this.agentPart = "";
            this.agencyPart = "";
        }
    }
    copyFrom(agentPaymentDetails)
    {
        this.companyName = agentPaymentDetails.companyName;
        this.agentNumber = agentPaymentDetails.agentNumber.slice();
        this.paymentType = agentPaymentDetails.paymentType;
        this.agentPart = agentPaymentDetails.agentPart;
        this.agencyPart = agentPaymentDetails.agencyPart;
    }
}

export class Agent {

    constructor(agent) {
        if(arguments.length > 0)
        {
            this.copyFrom(agent)
        }
        else
        {
            this.name = "";
            this.familyName = "";
            this.idNumber = "";
            this.phoneNumber = "";
            this.faxNumber = "";
            this.email =  "";
            this.active = true;
            this.paymentsDetails = [];
        }
    }
    copyFrom(agent)
    {
        this.name = agent.name;
        this.familyName = agent.familyName;
        this.idNumber = agent.idNumber;
        this.phoneNumber = agent.phoneNumber;
        this.faxNumber = agent.faxNumber;
        this.email =  agent.email;
        this.active = agent.active;
        this.paymentsDetails = [];
        for(var index = 0; index < agent.paymentsDetails.length; index++ )
        {
            var paymentDetails = new AgentPaymentDetails(agent.paymentsDetails[index])
            this.paymentsDetails.push(paymentDetails)
        }
    }
}