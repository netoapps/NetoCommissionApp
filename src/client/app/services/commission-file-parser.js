/**
 * Created by asaf on 18/08/2016.
 */
import XLSX from 'xlsx';


class CommissionFileParser {
    constructor() {

    }
    parseCommissionFile(file, callback)
    {
        var columns = []

        var reader = new FileReader();
        //var name = file.name;
        reader.onload = function(e)
        {
            try
            {
                var data = e.target.result;
                var workbook = XLSX.read(data,{type: 'binary'});
            }
            catch (err)
            {
                return callback({
                    success: false,
                    columns: null
                });
            }
            const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
            const ROWS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            var worksheet = workbook.Sheets[workbook.SheetNames[0]];
            var cell, c, r;
            var done = false
            for (r in ROWS)
            {
                for (c in COLS)
                {
                    cell = worksheet[COLS[c] + ROWS[r]]
                    if (cell)
                    {
                        columns.unshift(cell.v.toString())
                        done = true
                     }
                }
                if (done)
                {
                    callback({
                        success: true,
                        columns: columns,
                        dataRowNumber: r
                    })
                    break;
                }
            }
        }
        reader.readAsBinaryString(file);
    }
}

var commissionFileParser = new CommissionFileParser();
export default commissionFileParser;
