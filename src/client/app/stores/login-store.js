/**
 * Created by asaf on 28/04/2016.
 */

import Store from '../lib/store.js';
import dispatcher from '../dispatcher/app-dispatcher.js';
import Actions from '../actions/app-actions.js';

class LoginStore extends Store {

    constructor() {
        super('LoginStore');
        this.logger.debug('Initializing DataStore');
        this.initialize('user', {});
    }

    onAction(actionType, data)
    {
        this.logger.debug(`Received Action ${actionType} with data`, data);
    }
}

var loginStore = new LoginStore();
dispatcher.registerStore(loginStore);
export default loginStore;
