/**
 * Created by asaf on 09/07/16.
 */
import { strings } from '../constants/strings'

export class CommissionFile {

    constructor(commissionFile) {
        if(arguments.length > 0)
        {
            this.copyFrom(commissionFile)
        }
        else
        {
            var lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth()-1);

            this.name = "";
            this.company = "";
            this.paymentDate = lastMonth;
            this.uploadDate = new Date();
            this.note = "";
            this.taxState = strings.taxIncluded;
            this.taxValue = "";
            this.columnSettings = null
            this.dataRowNumber = -1
        }
    }
    copyFrom(commissionFile)
    {
        Object.assign(this, commissionFile);
    }
}