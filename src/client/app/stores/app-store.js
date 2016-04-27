/**
 * Created by asaf on 25/04/2016.
 */
import Store from '../lib/store.js';
import dispatcher from '../dispatcher/app-dispatcher.js';
import Actions from '../actions/app-actions.js';

class AppStore extends Store {

    constructor() {
        super('AppStore');
        this.logger.debug('Initializing AppStore');
        this.initialize('user', {});
    }

    onAction(actionType, data)
    {
        this.logger.debug(`Received Action ${actionType} with data`, data);
    }
}

var appStore = new AppStore();
dispatcher.registerStore(appStore);
export default appStore;
