/**
 * Created by asaf on 18/08/2016.
 */
import XLSX from 'xlsx';


class ExcelService
{
    constructor() {

    }
    generateSalaryReport()
    {
        // --- EXAMPLE 1 ---
        // in this example we want to build an Excel file with one sheet and write some stuff
        var ep=new ExcelPlus();
        // We're going to do several tasks in one line of code:
        // 1) create an Excel with one sheet called "Book1"
        // 2) write some data from an array to the new-created sheet
        // 3) create a new sheet called "Book2"
        // 4) write "A1" in cell "A1" of the new-created sheet
        // 5) write the today date in D1 of the "Book1" sheet
        // 6) save it on the user computer (this last step only works with IE10+ and modern browsers)
        ep.createFile("Book1")
            .write({ "content":[ ["A1","B1","C1"] ] })
            .createSheet("Book2")
            .write({ "cell":"A1", "content":"A1" })
            .write({ "sheet":"Book1", "cell":"D1", "content":new Date() })
            .saveAs("demo.xlsx");

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
                        columns.push(cell.v.toString())
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

var excelService = new ExcelService();
export default excelService;
