import React from 'react';

class TopBar extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <div className="fixed top-bar shadow">
                <div className="top-bar-container hcontainer-no-wrap">
                    <img className="top-bar-logo" src="./public/images/neto-logo.png"/>
                    <div className="vertical-line-sep"></div>
                </div>
            </div>
        </div>
    }

}


export default TopBar;