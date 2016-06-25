/**
 * Created by asaf on 25/04/2016.
 */
import AppDispatcher from '../dispatcher/app-dispatcher.js';

let ActionType = {

    USER_LOGGED_IN: 'USER_LOGGED_IN',
    USER_LOGGED_OUT: 'USER_LOGGED_OUT',

    DELETE_COMMISSION_DOC: 'DELETE_COMMISSION_DOC',

    UPDATE_AGENT: 'UPDATE_AGENT',
    DELETE_AGENT: 'DELETE_AGENT',

    UPDATE_PARTNERSHIP: 'UPDATE_PARTNERSHIP',
    DELETE_PARTNERSHIP: 'DELETE_PARTNERSHIP'


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
    //Commission files
    static deleteCommissionFile(fileName, callback)
    {
        AppDispatcher.dispatch(ActionType.DELETE_COMMISSION_DOC,{
            fileName: fileName,
            callback: callback
        });
    }

    //Agents
    static updateAgentAtIndex(index, agent)
    {
        AppDispatcher.dispatch(ActionType.UPDATE_AGENT,{
            index: index,
            agent: agent
        });
    }
    static deleteAgentAtIndex(index)
    {
        AppDispatcher.dispatch(ActionType.DELETE_AGENT,{
            index: index
        });
    }

    //Partnerships
    static updatePartnershipAtIndex(index, partnership)
    {
        AppDispatcher.dispatch(ActionType.UPDATE_PARTNERSHIP,{
            index: index,
            partnership: partnership
        });
    }
    static deletePartnershipAtIndex(index)
    {
        AppDispatcher.dispatch(ActionType.DELETE_PARTNERSHIP,{
            index: index
        });
    }
}

