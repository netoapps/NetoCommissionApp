/**
 * Created by efishtain on 27/08/2016.
 */

var Excel = require('exceljs');

function currencyFormattedString(stringFloatValue) {
    var value = stringFloatValue;
    value = parseFloat(value.replace(/,/g, ""))
        .toFixed(0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return value
}

function ReportsService() {
    this.createReport = function (name, date, salary, agencyAmount, portfolio, incomes, expenses, outputStream)
    {
        return new Promise(function(resolve, reject){
            var workbook = new Excel.Workbook();
            workbook.creator = 'Neto reporter'
            workbook.created = new Date();
            workbook.modified = new Date();

            var worksheet = workbook.addWorksheet('פירוט שכר - ' + name);
            worksheet.addRow(1, ["חודש שכר", date])

            for (var salaryItem in salary) {
                worksheet.addRow([salaryItem + ":", currencyFormattedString(salary[salaryItem].toString())])
            }
            worksheet.addRow(["", ""])
            worksheet.addRow(["גודל תיק:", currencyFormattedString(portfolio.toString())])
            worksheet.addRow(["סה״כ לחברת נטו:", currencyFormattedString(agencyAmount.toString())])
            worksheet.addRow(["", ""])
            worksheet.addRow(["הכנסות", ""])

            var incomeColumns = []
            for (var incomeCol = 0; incomeCol < incomes.columns.length; incomeCol++) {
                incomeColumns.push(incomes.columns[incomeCol].title)
            }
            worksheet.addRow(incomeColumns)
            for (var income = 0; income < incomes.data.length; income++) {
                var incomeRowData = incomes.data[income]
                var incomeRowDataOut = []
                for (incomeCol = 0; incomeCol < incomes.columns.length; incomeCol++) {
                    if(incomes.columns[incomeCol].key==='')
                    {
                        incomeRowDataOut.push('');
                    }else {
                        var incomeCellData = incomeRowData[incomes.columns[incomeCol].key].toString()
                        if (incomes.columns[incomeCol].format === "currency") {
                            incomeCellData = currencyFormattedString(incomeCellData)
                        }
                        incomeRowDataOut.push(incomeCellData)
                    }
                }
                worksheet.addRow(incomeRowDataOut)
            }

            worksheet.addRow(["", ""])
            worksheet.addRow(["הוצאות", ""])
            var expenseColumns = []
            for (var expenseCol = 0; expenseCol < expenses.columns.length; expenseCol++) {
                expenseColumns.push(expenses.columns[expenseCol].title)
            }
            worksheet.addRow(expenseColumns)
            for (var expense = 0; expense < expenses.data.length; expense++) {
                var expenseRowData = expenses.data[expense]
                var expenseRowDataOut = []
                for (expenseCol = 0; expenseCol < expenses.columns.length; expenseCol++) {
                    var expenseCellData = expenseRowData[expenses.columns[expenseCol].key].toString()
                    if (expenses.columns[expenseCol].format === "currency") {
                        expenseCellData = currencyFormattedString(expenseCellData)
                    }
                    expenseRowDataOut.push(expenseCellData)
                }
                worksheet.addRow(expenseRowDataOut)
            }
            workbook.xlsx.write(outputStream)
                .then(resolve)
                .catch(reject)
        })

    }
}

module.exports = ReportsService;