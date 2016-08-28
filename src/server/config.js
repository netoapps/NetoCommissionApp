/**
 * Created by efishtain on 25/04/2016.
 */
module.exports = {
    db:{
        connectionString:'mongodb://localhost:18873/agents',
        //connectionString:process.env.MONGO_CON,
        options:{
            //server:{
            //    auto_reconnect: true,
            //    socketOptions:{
            //        connectTimeoutMS:3600000,
            //        keepAlive:3600000,
            //        socketTimeoutMS:3600000
            //    }
            //}
            server:{
                auto_reconnect: true,
                poolSize: 10,
                socketOptions:{
                    keepAlive: 1
                }
            },
            db: {
                numberOfRetries: 10,
                retryMiliSeconds: 1000
            }
        }
    },
    datafilesDirectory:'../../datafiles',
    tokens:{
        secret:'ominubyvtcrxrzea'
    }
};