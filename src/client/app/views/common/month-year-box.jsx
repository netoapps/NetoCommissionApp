import React from 'react';
import Dropdown from 'muicss/lib/react/dropdown';
import DropdownItem from 'muicss/lib/react/dropdown-item';

var monthOptions = ["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר"];
export function getMonths()
{
    return monthOptions
}
export function getMonthName(monthNum)
{
    if(monthNum > 11 || monthNum < 0)
    {
        return monthOptions[0];
    }
    return monthOptions[monthNum];
}

export function getMonthNumber(monthName)
{
    return monthOptions.indexOf(monthName);
}


class MonthYearBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedMonth: props.month,
            selectedYear: props.year
        }
    }

    onMonthChange(item)
    {
        if(item != this.state.selectedMonth)
        {
            this.setState({selectedMonth: item});
            this.props.onMonthChange(item)
        }
    }
    onYearChange(item)
    {
        if(item != this.state.selectedYear)
        {
            this.setState({selectedYear: item});
            this.props.onYearChange(item)
        }
    }
    onLoadClick()
    {

    }

    render () {

        const months = [];
        for (let i = 0; i <= 11; i++ ) {
            var monthName = getMonthName(i)
            months.push(<DropdownItem className="mui--text-right" onClick={this.onMonthChange.bind(this,monthName)} value={monthName} key={i}>{monthName}</DropdownItem>);
        }
        const years = [];
        var date = new Date();
        var currentYear = date.getFullYear()
        for (let i = 2012; i <= currentYear; i++ ) {
            var yearName = i.toString()
            years.push(<DropdownItem className="mui--text-right" onClick={this.onYearChange.bind(this,yearName)}
                value={yearName} key={i}>{yearName}</DropdownItem>);
        }
        return (
            <div className="month-year-box">
                <Dropdown  variant="raised" label={this.state.selectedMonth} alignMenu="right" >
                    {months}
                </Dropdown>
                <div className="horizontal-spacer-10"/>
                <Dropdown variant="raised" label={this.state.selectedYear} alignMenu="right" >
                    {years}
                </Dropdown>
            </div>
        );
    }
}

export default MonthYearBox;

