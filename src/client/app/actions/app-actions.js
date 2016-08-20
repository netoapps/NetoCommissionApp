/**
 * Created by asaf on 25/04/2016.
 */
import AppDispatcher from '../dispatcher/app-dispatcher.js';

let ActionType = {

    APP_INIT: 'APP_INIT',

    USER_LOGGED_IN: 'USER_LOGGED_IN',
    USER_LOGGED_OUT: 'USER_LOGGED_OUT',

    DELETE_COMMISSION_FILE: 'DELETE_COMMISSION_FILE',
    DELETE_COMMISSION_FILE_COMPLETED: 'DELETE_COMMISSION_FILE_COMPLETED',
    UPLOAD_COMMISSION_FILE: 'UPLOAD_COMMISSION_FILE',
    UPLOAD_COMMISSION_FILE_COMPLETED: 'UPLOAD_COMMISSION_FILE_COMPLETED',
    COMMISSION_FILES_LOADED: 'COMMISSION_FILES_LOADED',

    ADD_AGENT: 'ADD_AGENT',
    UPDATE_AGENT: 'UPDATE_AGENT',
    DELETE_AGENT: 'DELETE_AGENT',
    AGENTS_LOADED: 'AGENTS_LOADED',

    ADD_PARTNERSHIP: 'ADD_PARTNERSHIP',
    UPDATE_PARTNERSHIP: 'UPDATE_PARTNERSHIP',
    DELETE_PARTNERSHIP: 'DELETE_PARTNERSHIP',
    PARTNERSHIPS_LOADED: 'PARTNERSHIPS_LOADED'

}
export {ActionType}

export default class AppActions {

    static appInit()
    {
        AppDispatcher.dispatch(ActionType.APP_INIT,{
        });
    }

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
        AppDispatcher.dispatch(ActionType.DELETE_COMMISSION_FILE,{
            fileName: fileName,
            callback: callback
        });
    }


    static uploadCommissionFile(commissionFile, draggedFile,columnSettings, callback)
    {
        AppDispatcher.dispatch(ActionType.UPLOAD_COMMISSION_FILE,{
            commissionFile: commissionFile,
            draggedFile: draggedFile,
            columnSettings:columnSettings,
            callback: callback
        });
    }


    //Agents
    static addAgent(agent)
    {
        AppDispatcher.dispatch(ActionType.ADD_AGENT,{
            agent: agent
        });
    }
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

    static addPartnership(partnership)
    {
        AppDispatcher.dispatch(ActionType.ADD_PARTNERSHIP,{
            partnership: partnership
        });
    }
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

