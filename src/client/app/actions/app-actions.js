/**
 * Created by asaf on 25/04/2016.
 */
import AppDispatcher from '../dispatcher/app-dispatcher.js';
import {LOGIN_USER, LOGOUT_USER} from '../constants/app-constants';
import RouterContainer from '../services/router-container'

export default class AppActions {

    /// LOGIN / LOGOUT ACTIONS
    static loginUser(jwt)
    {
        var savedJwt = localStorage.getItem('jwt');
        AppDispatcher.dispatch({
            actionType: LOGIN_USER,
            jwt: jwt
        });

        if (savedJwt !== jwt)
        {
            var nextPath = RouterContainer.get().getCurrentQuery().nextPath || '/';
            RouterContainer.get().transitionTo(nextPath);
            localStorage.setItem('jwt', jwt);
        }
        //dispatcher.dispatch('NAVIGATE', { location: newRoute });
    }

    static logoutUser(jwt)
    {
        RouterContainer.get().transitionTo('/login');
        localStorage.removeItem('jwt');
        AppDispatcher.dispatch({
            actionType: LOGOUT_USER
        });
    }


    //static requestFlickrData(tag) {
    //    dispatcher.dispatch('REQUEST-FLICKR-DATA', { tag: tag });
    //}
    //
    //static processFlickrData(data) {
    //    dispatcher.dispatch('PROCESS-FLICKR-DATA', data);
    //}
}
