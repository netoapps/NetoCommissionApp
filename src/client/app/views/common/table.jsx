import React from 'react';
var moment = require('moment')

class TableCell extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: (this.props.value == null) ? "":this.props.value,
            column: this.props.column,
            field: this.props.field,
            rowIndex: this.props.rowIndex
        }
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.value = (nextProps.value == null) ? "":nextProps.value
        this.state.column = nextProps.column
        this.state.rowIndex = nextProps.rowIndex
        this.setState(this.state)
    }

    onChange(event)
    {
        if(this.state.column.type == "select")
        {
            event.preventDefault();
            this.state.value = event.target.value;
            this.setState( this.state );
            var action = this.state.column.action
            action(this.state.rowIndex,event.target.value)
        }

    }


    render()
    {
        var className = "table-cell";
        var color = "table-cell-text-color";
        var node = null;
        var action = null;

        if(this.state.column.type === "read-only-request")
        {
            this.state.value = this.state.column.requestCellData(this.state.rowIndex,this.state.column.title)
        }
        if(this.state.column.type === "select-request")
        {
            this.state.value = this.state.column.requestCellData(this.state.rowIndex,this.state.column.title)
        }

        if (this.state.column.color === "red-green")
        {
            if(parseFloat(this.state.value) >= 0)
            {
                color = "green"
            }
            else
            {
                color = "red"
            }
        }
        if (this.state.column.format === "currency")
        {
            var value = this.state.value.toString();
            if(!isNaN(parseFloat(value)))
            {
                value = parseFloat(value.replace(/,/g, ""))
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                this.state.value = "₪ " + value
            }
        }
        if (this.state.column.format === "percent")
        {
            className = "table-cell-read-only " + color
            var value = parseInt(this.state.value);
            this.state.value = value + " %"
        }

        if (this.state.column.type === "read-only" || this.state.column.type === "read-only-request")
        {
            node = <div className={"table-cell-read-only " + color}>{this.state.value}</div>;
        }
        if (this.state.column.type === "full-date")
        {
            var formattedDate = moment(this.state.value).format('DD/MM/YYYY').toString();
            node = <div className={"table-cell-read-only " + color}>{formattedDate}</div>;
        }
        if (this.state.column.type === "month-year-date")
        {
            var formattedDate = moment(this.state.value).format('MM/YYYY').toString();
            node = <div className={"table-cell-read-only " + color}>{formattedDate}</div>;
        }

        if (this.state.column.type === "button")
        {
            action = this.state.column.action
            className = "table-button " + this.state.column.color
            node = <div className={"table-cell-read-only " + color}>
                <button className={className} onClick={ function(action) { action(this.state.rowIndex) }.bind(this,action)}>{this.state.value}</button>
            </div>;
        }
        if (this.state.column.type === "select" || this.state.column.type === "select-request")
        {
            const options = []
            for(let option = 0; option < this.state.column.options.length; option++)
            {
                options.push(<option key={option}
                                     value={this.state.column.options[option]}
                                     >{this.state.column.options[option]}</option>)
            }

            var selectedValue = this.state.column.options.indexOf(this.state.value) != -1 ? this.state.value:""
            node = <div className="h-center">
                        <div className="table-select">
                            <select onChange={this.onChange.bind(this)} value={selectedValue}>
                                {options}
                            </select>
                        </div>
                   </div>;



        }
        if (this.state.column.type === "input")
        {
            action = this.state.column.action
            node = <div className="h-center">
                        <input className="table-input"
                          type="text"
                          value={this.state.value}
                          onChange={ function(action,event) { action(this.state.rowIndex, event.target.value) }.bind(this,action) }/>
                   </div>
        }

        var divStyle = {width: this.state.column.width}
        return ( <div className={className} style={divStyle}>
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
        this.state.data = nextProps.data
        this.state.columns = nextProps.columns
        this.state.index = nextProps.index
        this.state.removableRow = !(nextProps.onRemoveRow == null)
        this.setState(this.state)
    }

    render() {
        var tableCells = [];
        for(var cell = 0; cell < this.state.columns.length; cell++)
        {
            var value = this.state.columns[cell].key === "-request-" ? "":this.state.data[this.state.columns[cell].key]
            tableCells[cell] = <TableCell key={cell}
                                          field={this.state.columns[cell].key}
                                          rowIndex={this.state.index}
                                          column={this.state.columns[cell]}
                                          value={value}/>
        }
        var removeRow = null
        var removeButtonClassName = "table-row-remove-button"
        var removeButtonFunc = function()
        {
            this.props.onRemoveRow()
        }.bind(this)

        if(this.state.removableRow)
        {
            if(this.props.isEditableRow != null)
            {
                if (!this.props.isEditableRow(this.state.data))
                {
                    removeButtonClassName = "table-row-remove-button-disabled"
                    removeButtonFunc = null
                }
            }
            removeRow = <button onClick={removeButtonFunc} className={removeButtonClassName}/>
        }
        var className = "table-row " + this.props.rowHoverClassName
        return  <div className={className} >
                    {removeRow}
                    <div className="table-row-data" onClick={ this.props.onRowClick != null ? this.props.onRowClick:null }>{tableCells} </div>
                 </div>;
    }
}

class TableColumn extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            column: this.props.column,
            searchText: ""
        }
        this.sortAscending = true
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.column = nextProps.column
        this.setState(this.state)
    }
    sortBy()
    {
        if(this.props.sortBy != null)
        {
            this.props.sortBy(this.state.column, this.sortAscending)
            this.sortAscending = !this.sortAscending
        }
    }
    onSearchTextChange(event)
    {
        this.state.searchText = event.target.value
        this.setState(this.state)
        if(this.props.onSearchTextChange != null)
        {
            this.props.onSearchTextChange(this.state.column, this.state.searchText)
        }
    }
    render()
    {
        var divStyle = {width: this.state.column.width}
        var className = "table-column";
        var searchBox = null
        if(this.state.column.searchBox)
        {
            searchBox = <div className={"table-column-search-box"} >
                            <input type="text"
                                   value={this.state.searchText}
                                   onChange={ this.onSearchTextChange.bind(this) }/>
                        </div>
        }
        return  <div className="table-column-container" style={divStyle}>
                    <div className={className} onClick={this.sortBy.bind(this)} >{this.state.column.title}</div>
                    {searchBox}
                </div>;
    }
}

class TableActionsColumn extends React.Component {

    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps)
    {

    }
    render() {
        if (this.props.onAddRow != null)
        {
            return <div className="table-column-add">
                        <button onClick={this.props.onAddRow.bind(this)} className="table-row-add-button">+</button>
                   </div>
        }
        else
        {
            return <div className="table-column-remove"/>
        }
    }
}


class Table extends React.Component {

    constructor(props) {
        super(props);

        var data = props.data
        if(props.sortedByColumn != null)
        {
            this.sortDataBy(data, props.sortedByColumn, false)
        }
        this.state = {
            columns: props.columns,
            data: data,
            filteredData: null
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.state.columns = nextProps.columns
        var data = nextProps.data
        if(nextProps.sortedByColumn != null)
        {
            this.sortDataBy(data, nextProps.sortedByColumn, false)
        }
        this.state.data = data
        this.setState(this.state)
    }
    onRowClick(index)
    {
        if (this.props.onRowClick != null)
        {
            this.props.onRowClick(index)
        }
    }
    sortDataBy(data, column,ascending)
    {
        var lexicographicSort = function(a, b)
        {
            var textA = a[column.key].toUpperCase();
            var textB = b[column.key].toUpperCase();
            if(ascending)
            {
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            }
            return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
        }
        var numericSort = function(a, b)
        {
            var numberA = a[column.key];
            var numberB = b[column.key];
            if(typeof numberA === 'string' || numberA instanceof String)
            {
                numberA = parseFloat(numberA)
            }
            if(typeof numberB === 'string' || numberB instanceof String)
            {
                numberB = parseFloat(numberB)
            }
            if(ascending)
            {
                return (numberA < numberB) ? -1 : (numberA > numberB) ? 1 : 0;
            }
            return (numberA > numberB) ? -1 : (numberA < numberB) ? 1 : 0;
        }
        if(column.format === "currency" || column.format === "percent")
        {
            data.sort(numericSort);
        }
        else
        {
            data.sort(lexicographicSort);
        }
    }
    onSortBy(column,ascending)
    {
        this.sortDataBy(this.state.data,column,ascending)
        this.setState(this.state)
    }
    onSearchTextChange(column,searchText)
    {
        this.state.filteredData = null
        if(searchText.length > 0)
        {
            this.state.filteredData = this.state.data.filter(function (el) {
                return (el[column.key].includes(searchText));
            });
        }
        this.setState(this.state)
    }
    render()
    {
        var data = this.state.filteredData == null ? this.state.data:this.state.filteredData
        var tableColumns = [];
        var searchBox = false

        if(this.props.hideHeader != true)
        {
            for(var col = 0; col < this.state.columns.length; col++)
            {
                tableColumns[col] = <TableColumn key={col}
                                                 onSearchTextChange={this.state.columns[col].searchBox ? this.onSearchTextChange.bind(this):null}
                                                 sortBy={this.onSortBy.bind(this)}
                                                 column={this.state.columns[col]} />
                if(this.state.columns[col].searchBox)
                {
                    searchBox = true
                }
            }
        }

        var title = null
        if(this.props.title != null)
        {
            title = this.props.title
        }

        if(data == null)
        {
            data = []
        }

        var tableRows = [];
        var rowHoverClassName = "";
        if(this.props.onRowClick != null)
        {
            rowHoverClassName = " table-row-hover"
        }

        for(var row = 0; row < data.length; row++) {

            var disableRowClick = false
            if(this.props.isEditableRow != null)
            {
                if (!this.props.isEditableRow(data[row]))
                {
                    disableRowClick = true
                }
            }

            var onRowClickFunc = function (index, rowData) {
                if (this.props.onRowClick != null)  this.props.onRowClick(index, rowData)
            }.bind(this, row, data[row])

            if(disableRowClick)
            {
                onRowClickFunc = null
            }

            var onRemoveRowClickFunc = null
            if(this.props.onRemoveRow != null)
            {
                onRemoveRowClickFunc = function (index, rowData)
                {
                    if (this.props.onRemoveRow != null)  this.props.onRemoveRow(index, rowData)
                }.bind(this, row, data[row])
            }

            tableRows[row] = <TableRow rowHoverClassName={rowHoverClassName}
                                       onRemoveRow={onRemoveRowClickFunc}
                                       isEditableRow={this.props.isEditableRow}
                                       onRowClick={onRowClickFunc}
                                       key={row} index={row}
                                       data={data[row]}
                                       columns={this.state.columns}/>
        }

        var tableTrashColumn = null
        if (this.props.onRemoveRow != null && this.props.hideHeader != true)
        {
            tableTrashColumn = <TableActionsColumn onAddRow={this.props.onAddRow}/>
        }

        var tableHeader = null
        if(this.props.hideHeader != true)
        {
            var headerColor = this.props.headerColor != null ? this.props.headerColor:"deafult-table-header-color"
            tableHeader = <div className={"table-header " + headerColor}>
                            {tableTrashColumn}
                            {tableColumns}
                          </div>
        }

        var containerClass = searchBox ? "table-data-with-search-container":"table-data-container"
        var heightClass =  this.props.heightClass != null ? this.props.heightClass:""
        var tableTitle = title != null ? <div className="table-title">{title}</div>:null

        return <div className={"table " + heightClass}>
                        {tableTitle}
                        {tableHeader}
                    <div className={containerClass}>
                        <div className="table-data">
                            {tableRows}
                        </div>
                    </div>
               </div>;
    }
}


export default Table;