/**
 * Created by asaf on 27/04/2016.
 */
import request from 'reqwest';
import AppActions from '../actions/app-actions';

class AuthService {

    login(email, password, callback)
    {
        this.pretendRequest(email,password,(res) => {
            if (res.authenticated)
            {
                localStorage.apiToken = res.apiToken
                localStorage.fullName = res.fullName
                localStorage.gender = res.gender
                if (callback)
                    callback(true)
                this.onChange(true)
            }
            else
            {
                if (callback)
                    callback(false)
                this.onChange(false)
            }
        })

        //request({
        //    url: AppConstants.LOGIN_URL,
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
                    apiToken: Math.random().toString(36).substring(7),
                    fullName: "קרין בוזלי לוי",
                    gender: "1"
                })
            }
            else
            {
                callback({
                    authenticated: false,
                    apiToken: "",
                    fullName: "",
                    gender: ""
                })
            }
        }, 0)
    }

    getLoginData()
    {
        return { apiToken: localStorage.apiToken,
                 fullName: localStorage.fullName,
                 gender: localStorage.gender}
    }
    logout()
    {
        delete localStorage.apiToken
        delete localStorage.fullName
        delete localStorage.gender
        this.onChange(false)
    }

    signup(username, password, extra)
    {
        //return this.handleAuth(when(request({
        //    url: AppConstants.SIGNUP_URL,
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
        return !!localStorage.apiToken
    }

    onChange() {}

}

export default new AuthService()
