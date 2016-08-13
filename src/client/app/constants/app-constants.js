/**
 * Created by asaf on 27/04/2016.
 */

var BASE_URL = 'http://localhost:3001/';

let AppConstants = {

    BASE_URL: BASE_URL,
    LOGIN_URL: BASE_URL + 'sessions/create',
    SIGNUP_URL: BASE_URL + 'users',

}

let AppActions = {

    //LOGIN_USER: 'LOGIN_USER',
    //LOGOUT_USER: 'LOGOUT_USER'
}

export { AppConstants, AppActions }

