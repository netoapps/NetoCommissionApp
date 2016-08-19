/**
 * Created by asaf on 18/08/2016.
 */

class CommissionFileParser {
    constructor() {

    }
    parseCommissionFile(file, callback)
    {
        var columns = ["אסף דגכד גכע גכע342גכ גכעיג יגכע", "xgdsf dsfh 45664fgfg fdg ", "לוי", "אפי345345345345 3fgd dfg dfgnfgn", "אפי", "אסף דגכד גכ89ע גכעגכ גכעיג יגכע","אסף דגכד גכע גכ456עגכ גכעיג יגכע"]


        callback({
            success: true,
            columns: columns
        })
    }
}

var commissionFileParser = new CommissionFileParser();
export default commissionFileParser;
