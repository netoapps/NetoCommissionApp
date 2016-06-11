import React from 'react';
import FlatRippleButton from './FlatRippleButton.jsx'

class TableCell extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value,
            column: this.props.column,
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.setState({
            value: nextProps.value,
            column: nextProps.column,
        })
    }

    render()
    {
        var className = "table-cell";
        var color = "table-cell-text-color";
        //var value = this.props.value;
        var node = null;

        if (this.state.column.color === "red-green")
        {
            if(parseFloat(this.props.value) >= 0)
            {
                color = "green"
            }
            else
            {
                color = "red"
            }
        }

        if (this.state.column.type === "read-only") {
            node = <div className={"table-cell-read-only " + color}>{this.props.value}</div>;
        }
        if (this.state.column.type === "read-only-currency")
        {
            var value = this.props.value;
            value = parseFloat(value.replace(/,/g, ""))
                .toFixed(0)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            value = "₪ " + value
            node = <div className={"table-cell-read-only " + color}>{value}</div>;

        }
        if (this.state.column.type === "read-only-percent")
        {
            var value = this.props.value;
            value = value + " %"
            node = <div className={"table-cell-read-only " + color}>{value}</div>;
        }
        if (this.state.column.type === "action")
        {
            const actions = [];
            for(var index = 0 ; index < this.props.value.length; index++)
            {
                var action = this.props.value[index]
                var className = "table-button " + action.color
                //actions.push(<button key={index} className={className} onClick={ function(action) { action.action(this.props.rowIndex) }.bind(this,action)}>{action.name}</button>)
                actions.push(<FlatRippleButton key={index} className={className} onClick={ function(action) { action.action(this.props.rowIndex) }.bind(this,action)}>{action.name}</FlatRippleButton>)
                actions.push(<div key={this.props.value.length + index} className="table-button-spacer"/>)
            }
            node = <div className={"table-cell-read-only hcontainer-no-wrap table-button-container " + color}>{actions}</div>;
        }

        //var node = <div className={"table-cell-read-only " + color}>{value}</div>;
        return ( <div className={className + " " + this.state.column.width}>
            {node}
        </div>);
    }
}


class TableRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            columns: this.props.columns,
            index: this.props.index
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.setState({
            data: nextProps.data,
            columns: nextProps.columns,
            index: nextProps.index
        })
    }
    render() {
        var tableCells = [];
        for(var cell = 0; cell < this.state.columns.length; cell++)
            tableCells[cell] = <TableCell key={cell}
                                          field={this.state.columns[cell].key}
                                          rowIndex={this.state.index}
                                          column={this.state.columns[cell]}
                                          value={this.state.data[this.state.columns[cell].key]}/>
        return  <div className="table-row">
                    {tableCells}
                 </div>;
    }
}

class TableColumn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            column: this.props.column
        }
    }
    render() {
        var className = "table-column " + this.state.column.width;
        return ( <div className={className}>{this.state.column.title}</div>);
    }
}


class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: props.columns,
            data: props.data
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            columns: nextProps.columns,
            data: nextProps.data
        })
    }

    render() {

        var tableColumns = [];
        for(var col = 0; col < this.state.columns.length; col++)
        {
            tableColumns[col] =<TableColumn key={col}
                                            column={this.state.columns[col]} />
        }

        var tableRows = [];
        for(var row = 0; row < this.state.data.length; row++)
            tableRows[row] = <TableRow key={row} index={row}
                                       data={this.state.data[row]}
                                       columns={this.state.columns}/>


        return <div className="table">
                    <div className="table-header">
                     {tableColumns}
                    </div>
                    <div className="table-data-container">
                        <div className="table-data">
                        {tableRows}
                        </div>
                    </div>
               </div>;
    }
}


export default Table;