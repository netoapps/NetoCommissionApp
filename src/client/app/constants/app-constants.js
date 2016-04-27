/**
 * Created by asaf on 27/04/2016.
 */
var BASE_URL = 'http://localhost:3001/';
export default {
    BASE_URL: BASE_URL,
    LOGIN_URL: BASE_URL + 'sessions/create',
    SIGNUP_URL: BASE_URL + 'users',

    //Actions
    LOGIN_USER: 'LOGIN_USER',
    LOGOUT_USER: 'LOGOUT_USER'
}
