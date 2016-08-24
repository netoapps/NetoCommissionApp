/**
 * Created by asaf on 18/08/2016.
 */

function currencyFormattedString(stringFloatValue)
{
    var value = stringFloatValue;
    value = parseFloat(value.replace(/,/g, ""))
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return value
}

class ExcelService
{
    constructor() {

    }
    generateSalaryReport(name,date,salary,agencyAmount,portfolio,incomes,expenses)
    {
        var ep = new ExcelPlus();
        var worksheet = ep.createFile("פירוט שכר - " + name )
        worksheet.writeRow(1,  ["חודש שכר", date] )

        for(var salaryItem in salary )
        {
            worksheet.writeNextRow([salaryItem + ":", currencyFormattedString(salary[salaryItem].toString())])
        }
        worksheet.writeNextRow(["", ""])
        worksheet.writeNextRow(["גודל תיק:", currencyFormattedString(portfolio.toString())])
        worksheet.writeNextRow(["סה״כ לחברת נטו:", currencyFormattedString(agencyAmount.toString())])
        worksheet.writeNextRow(["", ""])
        worksheet.writeNextRow(["הכנסות", ""])
        var incomeColumns = []
        for(var incomeCol = 0; incomeCol < incomes.columns.length ; incomeCol++)
        {
            incomeColumns.push(incomes.columns[incomeCol].title)
        }
        worksheet.writeNextRow(incomeColumns)
        for(var income = 0; income < incomes.data.length ; income++)
        {
            var incomeRowData = incomes.data[income]
            var incomeRowDataOut = []
            for(incomeCol = 0; incomeCol < incomes.columns.length ; incomeCol++)
            {
                var incomeCellData = incomeRowData[incomes.columns[incomeCol].key].toString()
                if(incomes.columns[incomeCol].format === "currency")
                {
                    incomeCellData = currencyFormattedString(incomeCellData)
                }
                incomeRowDataOut.push(incomeCellData)
            }
            worksheet.writeNextRow(incomeRowDataOut)
        }

        worksheet.writeNextRow(["", ""])
        worksheet.writeNextRow(["הוצאות", ""])
        var expenseColumns = []
        for(var expenseCol = 0; expenseCol < expenses.columns.length ; expenseCol++)
        {
            expenseColumns.push(expenses.columns[expenseCol].title)
        }
        worksheet.writeNextRow(expenseColumns)
        for(var expense = 0; expense < expenses.data.length ; expense++)
        {
            var expenseRowData = expenses.data[expense]
            var expenseRowDataOut = []
            for(expenseCol = 0; expenseCol < expenses.columns.length ; expenseCol++)
            {
                var expenseCellData = expenseRowData[expenses.columns[expenseCol].key].toString()
                if(expenses.columns[expenseCol].format === "currency")
                {
                    expenseCellData = currencyFormattedString(expenseCellData)
                }
                expenseRowDataOut.push(expenseCellData)
            }
            worksheet.writeNextRow(expenseRowDataOut)
        }
        worksheet.saveAs(name + ".xlsx");
    }
    parseCommissionFileColumns(file, callback)
    {
        var ep = new ExcelPlus();
        // we call openLocal() and when the file is loaded then we want to display its content
        // openLocal() will use the FileAPI if exists, otherwise it will use a Flash object
        ep.openRemote(file.preview,function(passed)
        {
            var dataRowNumber = -1
            var columns = []

            if (!passed)
            {
                callback({success: false,
                    columns: columns,
                    dataRowNumber: dataRowNumber
                })
                return
            }
            //Search for starting data x,y
            for(var row = 1; row < 15; row++)
            {
                var data = ep.selectSheet(1).read("A"+row+":Z"+row)
                if(data instanceof Array)
                {
                    var rowData = data[0]
                    for(var cell = 0; cell < rowData.length; cell++)
                    {
                        if(rowData[cell] != null)
                        {
                            columns.push(rowData[cell].toString())
                            dataRowNumber = row
                        }
                    }
                    if(dataRowNumber != -1)
                    {
                        callback({success: true,
                                  columns: columns,
                                  dataRowNumber: dataRowNumber
                        })
                        return
                    }
                }
            }
            callback({success: false,
                columns: columns,
                dataRowNumber: dataRowNumber
            })
        })
    }
}

var excelService = new ExcelService();
export default excelService;