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
                apiToken: localStorage.apiToken,
                name:localStorage.name,
                familyName: localStorage.familyName
            });
    }

    setUserData(apiToken,name,familyName)
    {
        this.set('user',
            {
                apiToken: apiToken,
                name:name,
                familyName: familyName
            });


        if(apiToken === "")
        {
            delete localStorage.apiToken
            delete localStorage.fullName
            delete localStorage.gender

            console.log("USER_LOGGED_OUT")
            this.eventbus.emit(ActionType.USER_LOGGED_OUT);
        }
        else
        {
            localStorage.apiToken = apiToken
            localStorage.name = name
            localStorage.familyName = familyName

            console.log("USER_LOGGED_IN")
            AppActions.appInit();
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

