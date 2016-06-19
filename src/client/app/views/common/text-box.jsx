import React from 'react';

class TextBox extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            notes: this.props.value
        }
    }

    componentDidMount ()
    {
        //var maxRowCount = this.props.maxRowCount;
        //var id = "#"+this.props.id;
        //$(function ()
        //{
        //    var lines = maxRowCount;
        //    $(id).keydown(function(e)
        //    {
        //        var newLines = $(this).val().split("\n").length;
        //        if(e.keyCode == 13 && newLines >= lines)
        //            return false;
        //    });
        //});
    }
    onBlur(event)
    {
        event.preventDefault();
        if((this.props.onBlur != null) /*&& (event.target.value != this.state.value)*/)
        {
            this.props.onBlur(event.target.value);
        }
    }
    onChange(event)
    {
        event.preventDefault();
        this.setState({notes: event.target.value});
    }
    render()
    {
        var rowHeight = 22;
        var textBoxStyle = { height: 2 * rowHeight + 4 };

        return ( <div>
            <form>
                <label>
                    {this.props.title}
                        <textarea style={textBoxStyle}
                                  className="text-box"
                                  id={this.props.id}
                                  value={this.state.notes}
                                  onChange={this.onChange}
                                  onBlur={this.onBlur}/>
                </label>
            </form>
        </div>);
    }
}

export default TextBox;

