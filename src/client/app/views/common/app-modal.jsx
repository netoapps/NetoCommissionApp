import React from 'react';
import Signals from 'signals';

export default class AppModal extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modalContent: props.modalContent
        };
    }
    componentWillReceiveProps(nextProps)
    {
        this.state.modalContent = nextProps.modalContent
        this.setState(this.state)
    }
    render(){
        return (
            <div className="modal-overlay modal-animate fadeIn">
                <div className="modal modal-animate modal-zoom-in">
                    {this.state.modalContent}
                </div>
            </div>
        );
    }
}

class ModalSignals
{
    constructor()
    {
        this.showWithContentSignal = new Signals()
        this.hideSignal = new Signals()
    }
    showWithContent(content)
    {
        this.showWithContentSignal.dispatch(content)
    }
    hide()
    {
        this.hideSignal.dispatch()
    }
}


var Modal = new ModalSignals()
export { Modal }