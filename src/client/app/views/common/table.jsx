import React from 'react';
var moment = require('moment')

class TableCell extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: (this.props.value == null) ? "":this.props.value,
            column: this.props.column,
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
                    .toFixed(0)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                this.state.value = "₪ " + value
            }
        }
        if (this.state.column.format === "percent")
        {
            className = "table-cell-read-only " + color
            var value = this.state.value;
            this.state.value = value + " %"
        }

        if (this.state.column.type === "read-only")
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
        if (this.state.column.type === "select")
        {
            // const options = [];
            // action = this.state.column.action
            // for (let type = 0; type <= this.state.column.options.length; type++ ) {
            //     options.push(<DropdownItem onClick={ function(action,item) { action(this.props.rowIndex,item) }.bind(this,action)}
            //                                value={this.state.column.options[type]}
            //                                key={type}>{this.state.column.options[type]}</DropdownItem>);
            // }
            // node = <div className="h-center">
            //           <TableDropdown  className="table-dropdown" label={this.state.value} alignMenu="right" >
            //             {options}
            //           </TableDropdown>
            //        </div>;


            const options = []
            for(let option = 0; option < this.state.column.options.length; option++)
            {
                options.push(<option key={option}
                                     value={this.state.column.options[option]}
                                     >{this.state.column.options[option]}</option>)
            }

            node = <div className="h-center">
                        <div className="table-select">
                            <select onChange={this.onChange.bind(this)} defaultValue={this.state.value}>
                                {options}
                            </select>
                        </div>
                   </div>;



        }
        if (this.state.column.type === "input")
        {
            action = this.state.column.action
            node = <div className="h-center"><input className="table-input"
                          type="text"
                          value={this.state.value}
                          onChange={ function(action,event) { action(this.state.rowIndex, event.target.value) }.bind(this,action) }/></div>
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
        this.state.data = nextProps.data
        this.state.columns = nextProps.columns
        this.state.index = nextProps.index
        this.state.removableRow = !(nextProps.onRemoveRow == null)
        this.setState(this.state)
    }
    onRowClick()
    {
        if(this.props.onRowClick != null)
            this.props.onRowClick(this.state.index)
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
        var removeButtonClassName = "table-row-remove-button"
        var removeButtonFunc = function(index)
        {
            this.props.onRemoveRow(index)
        }.bind(this,this.state.index)

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
                    <div className="table-row-data" onClick={this.onRowClick.bind(this)}>{tableCells} </div>
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
    componentWillReceiveProps(nextProps)
    {
        this.state.column = nextProps.column
        this.setState(this.state)
    }
    render()
    {
        var className = "table-column " + this.state.column.width;
        return ( <div className={className}>{this.state.column.title}</div>);
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

        this.state = {
            columns: props.columns,
            data: props.data
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.state.columns = nextProps.columns
        this.state.data = nextProps.data
        this.setState(this.state)
    }
    onRowClick(index)
    {
        if (this.props.onRowClick != null)
        {
            this.props.onRowClick(index)
        }
    }
    render()
    {
        var data = this.state.data
        var tableColumns = [];

        if(this.props.hideHeader != true)
        {
            for(var col = 0; col < this.state.columns.length; col++)
            {
                tableColumns[col] =<TableColumn key={col}
                                                column={this.state.columns[col]} />
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
            tableRows[row] = <TableRow rowHoverClassName={rowHoverClassName}
                                       onRemoveRow={this.props.onRemoveRow}
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
            tableHeader = <div className="table-header">
                            {tableTrashColumn}
                            {tableColumns}
                          </div>
        }

        return <div className="table">
                    <div className="table-title">{title}</div>
                        {tableHeader}
                    <div className="table-data-container">
                        <div className="table-data">
                        {tableRows}
                        </div>
                    </div>
               </div>;
    }
}


export default Table;