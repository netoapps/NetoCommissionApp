/**
 * Created by asaf on 25/04/2016.
 */
import AppDispatcher from '../dispatcher/app-dispatcher.js';

let ActionType = {

    APP_INIT: 'APP_INIT',
    APP_INIT_COMPLETED: 'APP_INIT_COMPLETED',

    USER_LOGGED_IN: 'USER_LOGGED_IN',
    USER_LOGGED_OUT: 'USER_LOGGED_OUT',

    LOAD_COMPANIES: 'LOAD_COMPANIES',

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


    static uploadCommissionFile(commissionFile, draggedFile, callback)
    {
        AppDispatcher.dispatch(ActionType.UPLOAD_COMMISSION_FILE,{
            commissionFile: commissionFile,
            draggedFile: draggedFile,
            callback: callback
        });
    }


    //Agents
    static addAgent(agent, callback)
    {
        AppDispatcher.dispatch(ActionType.ADD_AGENT,{
            agent: agent,
            callback:callback
        });
    }
    static updateAgent(idNumber, agent, callback)
    {
        AppDispatcher.dispatch(ActionType.UPDATE_AGENT,{
            idNumber: idNumber,
            agent: agent,
            callback:callback
        });
    }
    static deleteAgent(idNumber, callback)
    {
        AppDispatcher.dispatch(ActionType.DELETE_AGENT,{
            idNumber: idNumber,
            callback:callback
        });
    }

    //Partnerships

    static addPartnership(partnership, callback)
    {
        AppDispatcher.dispatch(ActionType.ADD_PARTNERSHIP,{
            partnership: partnership,
            callback:callback
        });
    }
    static updatePartnership(partnershipId, partnership, callback)
    {
        AppDispatcher.dispatch(ActionType.UPDATE_PARTNERSHIP,{
            partnershipId: partnershipId,
            partnership: partnership,
            callback:callback
        });
    }
    static deletePartnership(partnershipId, callback)
    {
        AppDispatcher.dispatch(ActionType.DELETE_PARTNERSHIP,{
            partnershipId: partnershipId,
            callback:callback
        });
    }
    static loadCompanies()
    {
        AppDispatcher.dispatch(ActionType.LOAD_COMPANIES);
    }

}

