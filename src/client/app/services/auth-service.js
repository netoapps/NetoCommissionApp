/**
 * Created by asaf on 27/04/2016.
 */
import request from 'reqwest';
import {LOGIN_URL, SIGNUP_URL} from '../constants/app-constants';
import AppActions from '../actions/app-actions';

class AuthService {

    login(email, password, callback)
    {
        this.pretendRequest(email,password,(res) => {
            if (res.authenticated)
            {
                localStorage.token = res.token
                if (callback)
                    callback(true,"success")
                this.onChange(true)
            }
            else
            {
                if (callback)
                    callback(false,"login failure")
                this.onChange(false)
            }
        })

        //request({
        //    url: LOGIN_URL,
        //    type: 'json',
        //    method: 'POST',
        //    crossOrigin: true,
        //    data: {
        //        username,
        //        password
        //    },
        //    error: function (err)
        //    {
        //        callback(false,err)
        //    },
        //    success: function (response)
        //    {
        //        localStorage.apiToken = response.apiToken

        //        callback(true,"success")
        //     //   AppActions.loginUser(response.apiToken);
        //    }
        //})
    }

    pretendRequest(email, pass, callback)
    {
        setTimeout(() => {
            if (email === 'karin@neto-finance.co.il' && pass === '1111') {
                callback({
                    authenticated: true,
                    token: Math.random().toString(36).substring(7)
                })
            } else {
                callback({ authenticated: false })
            }
        }, 0)
    }

    getToken()
    {
        return localStorage.apiToken
    }
    logout()
    {
        AppActions.logoutUser();
    }

    signup(username, password, extra)
    {
        //return this.handleAuth(when(request({
        //    url: SIGNUP_URL,
        //    method: 'POST',
        //    crossOrigin: true,
        //    type: 'json',
        //    data: {
        //        username, password, extra
        //    }
        //})));
    }

    loggedIn()
    {
        return localStorage.apiToken != null
    }

    onChange() {}

}

export default new AuthService()
