/**
 * Created by efishtain on 22/07/2016.
 */

const commissionType = ["נפרעים","היקף","בונוס"];
const companies = ["כלל ביטוח","כלל גמל","מגדל","מנורה","אלטשולר שחם","ילין לפידות","מיטב דש","הראל","הפניקס","אנליסט","איי בי איי","אקסלנס","הכשרה"];

function ConstantsService(){
    this.getCommisionTypes = function(){
        return commissionType;
    };

    this.getCompanyNames = function(){
        return companies;
    };
}

module.exports = ConstantsService;