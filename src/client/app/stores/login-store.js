/**
 * Created by asaf on 28/04/2016.
 */

import Store from '../lib/store.js';
import dispatcher from '../dispatcher/app-dispatcher.js';
import {ActionType} from '../actions/app-actions.js';
import AppActions from '../actions/app-actions'

class LoginStore extends Store {

    constructor()
    {
        super('LoginStore');
        this.logger.debug('Initializing DataStore');
        this.initialize('user',
            {
                apiToken: "",
                name:"",
                familyName: "",
                gender: ""
            });
    }

    setUserData(apiToken,name,familyName,gender)
    {
        this.set('user',
            {
                apiToken: apiToken,
                name:name,
                familyName: familyName,
                gender: gender
            });
        if(apiToken === "")
        {
            console.log("USER_LOGGED_OUT")
            this.eventbus.emit(ActionType.USER_LOGGED_OUT);
        }
        else
        {
            console.log("USER_LOGGED_IN")
            AppActions.appInit();
            //this.eventbus.emit(ActionType.USER_LOGGED_IN);
        }
    }
    getUserData()
    {
        return this.get('user');
    }

    onAction(actionType, data)
    {

    }
}

var loginStore = new LoginStore();
dispatcher.registerStore(loginStore);
export default loginStore;

