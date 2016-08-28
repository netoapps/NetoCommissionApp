/**
 * Created by asaf on 27/04/2016.
 */
import request from 'reqwest';
import LoginStore from '../stores/login-store';
import {AppConstants} from '../constants/app-constants';


class AuthService {

    login(email, password, callback)
    {
        // this.pretendRequest(email,password,(res) => {
        //     if (res.authenticated)
        //     {
        //         localStorage.apiToken = res.apiToken
        //         localStorage.fullName = res.fullName
        //         localStorage.gender = res.gender
        //         if (callback)
        //             callback(true)
        //         this.onChange(true)
        //     }
        //     else
        //     {
        //         if (callback)
        //             callback(false)
        //         this.onChange(false)
        //     }
        // })

        request({
           url: AppConstants.LOGIN_URL,
           type: 'json',
           method: 'POST',
           data: {
               username:email,
               password:password
           },
           error: function (err)
           {
               callback({authenticated:false},err)
           },
           success: function (response)
           {
               LoginStore.setUserData(response.apiToken,response.name,response.familyName,response.gender)
               callback({
                   authenticated: true,
                   apiToken: response.apiToken,
                   fullName: response.name + " " + response.familyName,
                   gender: response.gender
               })
           }
        })
    }

    // pretendRequest(email, pass, callback)
    // {
    //     setTimeout(() => {
    //         if (email === 'karin@neto-finance.co.il' && pass === '1111') {
    //             callback({
    //                 authenticated: true,
    //                 apiToken: Math.random().toString(36).substring(7),
    //                 fullName: "קרין בוזלי לוי",
    //                 gender: "1"
    //             })
    //         }
    //         else
    //         {
    //             callback({
    //                 authenticated: false,
    //                 apiToken: "",
    //                 fullName: "",
    //                 gender: ""
    //             })
    //         }
    //     }, 0)
    // }

    // getLoginData()
    // {
    //     return { apiToken: localStorage.apiToken,
    //              fullName: localStorage.fullName,
    //              gender: localStorage.gender}
    // }
    logout()
    {
        LoginStore.setUserData("","","","")

        // delete localStorage.apiToken
        // delete localStorage.fullName
        // delete localStorage.gender
    }
    signup(email, password,name,familyName, callback)
    {
        request({
            url: AppConstants.SIGNUP_URL,
            type: 'json',
            method: 'POST',
            data: {
                username:email,
                password:password,
                name:name,
                familyName:familyName
            },
            error: function (err)
            {
                callback({authenticated:false},err)
            },
            success: function (response)
            {
                // localStorage.apiToken = response.apiToken
                // localStorage.fullName = name + " " + familyName
                // localStorage.gender = "0"
                LoginStore.setUserData(response.apiToken,response.name,response.familyName,response.gender)
                callback({
                    authenticated: true,
                    apiToken: response.apiToken,
                    fullName: response.name + " " + response.familyName,
                    gender: response.gender
                })
            }
        })
    }

    loggedIn()
    {
        return LoginStore.getUserData().apiToken
    }
}

export default new AuthService()
