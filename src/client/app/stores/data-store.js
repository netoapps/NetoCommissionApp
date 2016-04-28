/**
 * Created by asaf on 25/04/2016.
 */
import Store from '../lib/store.js';
import dispatcher from '../dispatcher/app-dispatcher.js';
import Actions from '../actions/app-actions.js';

class DataStore extends Store {

    constructor() {
        super('DataStore');
        this.logger.debug('Initializing DataStore');
        this.initialize('user', {});
    }

    onAction(actionType, data)
    {
        this.logger.debug(`Received Action ${actionType} with data`, data);
    }
}

var dataStore = new DataStore();
dispatcher.registerStore(dataStore);
export default dataStore;
