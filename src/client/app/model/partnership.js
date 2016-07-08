/**
 * Created by asaf on 28/06/16.
 */

export class PartnershipPaymentDetails {

    constructor(partnershipPaymentDetails) {
        if(arguments.length > 0)
        {
            this.copyFrom(partnershipPaymentDetails)
        }
        else
        {
            this.companyName = "";
            this.partnershipNumber = "";
            this.paymentType = "";
            this.partnershipPart = "";
        }
    }
    copyFrom(partnershipPaymentDetails)
    {
        this.companyName = partnershipPaymentDetails.companyName;
        this.partnershipNumber = partnershipPaymentDetails.partnershipNumber;
        this.paymentType = partnershipPaymentDetails.paymentType;
        this.partnershipPart = partnershipPaymentDetails.partnershipPart;
    }
}

export class PartnershipAgentDetails {

    constructor(partnershipAgentDetails) {
        if(arguments.length > 0)
        {
            this.copyFrom(partnershipAgentDetails)
        }
        else
        {
            this.idNumber = "";
            this.part = "";
        }
    }
    copyFrom(partnershipPaymentDetails)
    {
        this.idNumber = partnershipPaymentDetails.idNumber;
        this.part = partnershipPaymentDetails.part;
    }
}


export class Partnership {

    constructor(partnership)
    {
        if(arguments.length > 0)
        {
            this.copyFrom(partnership)
        }
        else
        {
            this.active = true;
            this.agentsDetails = [];
            this.paymentsDetails = [];
        }
    }
    copyFrom(partnership)
    {
        var index
        this.active = partnership.active;
        this.agentsDetails = [];
        for(index = 0; index < partnership.agentsDetails.length; index++ )
        {
            var agentsDetails = new PartnershipAgentDetails(partnership.agentsDetails[index])
            this.agentsDetails.push(agentsDetails)
        }
        this.paymentsDetails = [];
        for(index = 0; index < partnership.paymentsDetails.length; index++ )
        {
            var paymentDetails = new PartnershipPaymentDetails(partnership.paymentsDetails[index])
            this.paymentsDetails.push(paymentDetails)
        }
    }
}