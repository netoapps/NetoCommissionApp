/**
 * Created by asaf on 09/07/16.
 */
var moment = require('react-datepicker/node_modules/moment')

export class CommissionFile {

    constructor(commissionFile) {
        if(arguments.length > 0)
        {
            this.copyFrom(commissionFile)
        }
        else
        {
            this.draggedfile = null;
            this.name = "";
            this.company = "";
            this.paymentDate = new Date();
            this.uploadDate = new Date();
            this.note = "";
            this.taxState = "";
            this.taxValue = "";
        }
    }
    copyFrom(commissionFile)
    {
        this.draggedfile = commissionFile.draggedfile;
        this.name = commissionFile.name;
        this.company = commissionFile.company;
        this.paymentDate = commissionFile.paymentDate;
        this.uploadDate = commissionFile.uploadDate;
        this.note = commissionFile.note;
        this.taxState = commissionFile.taxState;
        this.taxValue = commissionFile.taxValue;
    }
}