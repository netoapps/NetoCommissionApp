/**
 * Created by asaf on 25/04/2016.
 */
import AppDispatcher from '../dispatcher/app-dispatcher.js';

let ActionType = {

    USER_LOGGED_IN: 'USER_LOGGED_IN',
    USER_LOGGED_OUT: 'USER_LOGGED_OUT',
    DELETE_COMMISSION_DOC: 'DELETE_COMMISSION_DOC'
}
export {ActionType}

export default class AppActions {

    static userLoggedIn(apiToken, fullName, gender)
    {
        AppDispatcher.dispatch(ActionType.USER_LOGGED_IN,{
            apiToken: apiToken,
            fullName: fullName,
            gender: gender
        });
    }
    static userLoggedOut()
    {
        AppDispatcher.dispatch(ActionType.USER_LOGGED_OUT,{ });
    }
    static deleteCommissionFile(fileName, callback)
    {
        AppDispatcher.dispatch(ActionType.DELETE_COMMISSION_DOC,{
            fileName: fileName,
            callback: callback
        });
    }
}

