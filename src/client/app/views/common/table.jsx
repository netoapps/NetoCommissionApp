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
        var action = null;

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
        if (this.state.column.type === "read-only-button")
        {
            action = this.state.column.action
            className = "table-button " + this.state.column.color
            node = <div className={"table-cell-read-only " + color}>
                <button className={className} onClick={ function(action) { action(this.props.rowIndex) }.bind(this,action)}>{this.props.value}</button>
            </div>;
        }
        return ( <div className={className + " " + this.state.column.width}>
            {node}
        </div>);
    }
}


class TableRow extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            columns: props.columns,
            index: props.index,
            removableRow: !(props.onRemoveRow == null)
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
        var removeRow = null
        if(this.state.removableRow)
        {
            removeRow = <button onClick= { function(index) { this.props.onRemoveRow(index) }.bind(this,this.state.index)} className="table-row-remove-button"/>
        }

        return  <div className="table-row">
                    {removeRow}
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

class TableTrashColumn extends React.Component {

    constructor(props) {
        super(props);


    }
    render() {
        var className = "table-column-trash";
        return ( <div className={className}></div>);
    }
}


class Table extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            columns: props.columns,
            data: props.data,
            removableRow: !(props.onRemoveRow == null)
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({
            columns: nextProps.columns,
            data: nextProps.data
        })
    }

    render()
    {
       var tableColumns = [];
        for(var col = 0; col < this.state.columns.length; col++)
        {
            tableColumns[col] =<TableColumn key={col}
                                            column={this.state.columns[col]} />
        }

        if(this.state.data == null)
        {
            return <div className="table">
                <div className="table-header">
                    {tableColumns}
                </div>
            </div>;
        }

        var tableRows = [];
        for(var row = 0; row < this.state.data.length; row++)
            tableRows[row] = <TableRow onRemoveRow = {this.props.onRemoveRow}
                                       key={row} index={row}
                                       data={this.state.data[row]}
                                       columns={this.state.columns}/>

        var tableTrashColumn = null
        if(this.state.removableRow)
        {
            tableTrashColumn = <TableTrashColumn/>
        }

        return <div className="table">
                    <div className="table-header">
                        {tableTrashColumn}
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