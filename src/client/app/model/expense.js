/**
 * Created by asaf on 13/08/2016.
 */

export default class Expense
{
    constructor(expense)
    {
        if(arguments.length > 0 && expense != null)
        {
            this.copyFrom(expense)
        }
        else
        {
            this._id = ""
            this.type = ""
            this.amount = 0
            this.expenseDate = 0
            this.notes = ""
            this.repeat = 1
        }
    }
    copyFrom(expense)
    {
        Object.assign(this, expense);
    }
}