/**
 * Created by asaf on 25/04/2016.
 */
import AppDispatcher from '../dispatcher/app-dispatcher.js';

let ActionType = {

    USER_LOGGED_IN: 'USER_LOGGED_IN',
    USER_LOGGED_OUT: 'USER_LOGGED_OUT'
}
export {ActionType}

export default class AppActions {

    static userLoggedIn(apiToken, fullName, gender)
    {
        AppDispatcher.dispatch({
            actionType: ActionType.USER_LOGGED_IN,
            apiToken: apiToken,
            fullName: fullName,
            gender: gender
        });
    }
    static userLoggedOut()
    {
        AppDispatcher.dispatch({
            actionType: ActionType.USER_LOGGED_OUT
        });
    }
}

