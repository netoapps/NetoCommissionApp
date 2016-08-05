import React from 'react';
import FixedWidthDropdown from './../common/fixed-width-dropdown.jsx';
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
        if(item.props.value != this.state.selectedMonth)
        {
            this.setState({selectedMonth: item.props.value});
            this.props.onMonthChange(item.props.value)
        }
    }
    onYearChange(item)
    {
        if(item.props.value != this.state.selectedYear)
        {
            this.setState({selectedYear: item.props.value});
            this.props.onYearChange(item.props.value)
        }
    }
    onLoadClick()
    {

    }

    render () {

        const months = [];
        for (let i = 0; i <= 11; i++ ) {
            var monthName = getMonthName(i)
            months.push(<DropdownItem onClick={this.onMonthChange.bind(this)} value={monthName} key={i}>{monthName}</DropdownItem>);
        }
        const years = [];
        var date = new Date();
        var currentYear = date.getFullYear()
        for (let i = 2012; i <= currentYear; i++ ) {
            var yearName = i.toString()
            years.push(<DropdownItem onClick={this.onYearChange.bind(this)}
                value={yearName} key={i}>{yearName}</DropdownItem>);
        }
        return (
            <div className="month-year-box">
                <FixedWidthDropdown shadow label={this.state.selectedMonth} alignMenu="right" >
                    {months}
                </FixedWidthDropdown>
                <div className="horizontal-spacer-10"/>
                <FixedWidthDropdown shadow className="fixed-size-button" label={this.state.selectedYear} alignMenu="right" >
                    {years}
                </FixedWidthDropdown>
            </div>
        );
    }
}

export default MonthYearBox;

