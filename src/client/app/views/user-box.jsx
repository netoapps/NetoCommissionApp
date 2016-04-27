import React from 'react';

class UserBox extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="user-box hcontainer-no-wrap">
                <img className="user-avatar" src={this.props.user.avatar} alt="" />
                <div className="user-box-info">
                    <div className="user-box-name">{this.props.user.name + " " + this.props.user.familyName}</div>
                    <p className="user-box-logout-button"><a href="/logout">{strings.disconnect}</a></p>
                </div>
            </div>
        );
    }

}

UserBox.propTypes = {
    user: React.PropTypes.object.isRequired
};


export default UserBox;