/**
 * Created by asaf on 13/08/2016.
 */

export default class Income
{
    constructor(income)
    {
        if(arguments.length > 0 && income != null)
        {
            this.copyFrom(income)
        }
        else
        {
            this._id = ""
            this.company = ""
            this.agentInCompanyId = ""
            this.type = ""
            this.amount = 0
            this.paymentDate = ""
            this.repeat = 1
            this.notes = ""
        }
    }
    copyFrom(income)
    {
         Object.assign(this, income);
    }
}