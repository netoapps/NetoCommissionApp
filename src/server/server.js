//var express = require('express')
//var path = require('path')
//
//var app = express()
//
//// serve our static stuff like index.css
//app.use(express.static(__dirname + '../client/public'))
//
//// send all requests to index.html so browserHistory in React Router works
//app.get('*', function (req, res)
//{
//  res.sendFile(path.join(__dirname+ '../client/', 'index.html'))
//})
//
//var PORT = 8090
//app.listen(PORT, function()
//{
//  console.log('Production Express server running at localhost:' + PORT)
//})


var express      = require('express');
var bodyParser   = require('body-parser');
var https        = require('https');
var path         = require('path');

var NetoCommissionApp = function() {

  //  Scope.
  var self = this;

  /*  ================================================================  */
  /*  Helper functions.                                                 */
  /*  ================================================================  */

  /**
   *  Set up server IP address and port # using env variables/defaults.
   */
  self.setupVariables = function() {
    //  Set the environment variables we need.
    self.ipaddress = process.env.OPENSHIFT_NODEJS_IP ;
    self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8090;

    if (typeof self.ipaddress === "undefined") {
      //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
      //  allows us to run/test the app locally.
      console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
      self.ipaddress = "127.0.0.1";
    };
  };

  /**
   *  terminator === the termination handler
   *  Terminate server on receipt of the specified signal.
   *  @param {string} sig  Signal to terminate on.
   */
  self.terminator = function(sig){
    if (typeof sig === "string") {
      console.log('%s: Received %s - terminating sample app ...',
          Date(Date.now()), sig);
      process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
  };


  /**
   *  Setup termination handlers (for exit and a list of signals).
   */
  self.setupTerminationHandlers = function(){
    //  Process on exit and signals.
    process.on('exit', function() { self.terminator(); });

    // Removed 'SIGPIPE' from the list - bugz 852598.
    ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
      'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
      process.on(element, function() { self.terminator(element); });
    });
  };


  /*  ================================================================  */
  /*  App server functions (main app logic here).                       */
  /*  ================================================================  */

  /**
   *  Initialize the server (express) and create the routes and register
   *  the handlers.
   */
  self.initializeServer = function()
  {
    self.app = express();


    // set up our express application
    self.app.use(bodyParser.json({limit: '50mb'}));
    self.app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
    self.app.use(express.static(__dirname + '/../client'));

    self.app.get('/', function (req, res)
    {
        var file = path.join(__dirname + '/../client/', 'index.html')
        res.sendfile(file)
    })

  };

  /**
   *  Initializes the sample application.
   */
  self.initialize = function() {
    self.setupVariables();
    self.setupTerminationHandlers();
    // Create the express server and routes.
    self.initializeServer();
  };


  /**
   *  Start the server (starts up the sample application).
   */
  self.start = function() {
    //Start the app on the specific interface (and port).
    self.app.listen(self.port, self.ipaddress, function () {
      console.log('%s: Node server started on %s:%d ...',
          Date(Date.now()), self.ipaddress, self.port);

      //var hscert = fs.readFileSync('neto-netoform.rhcloud-cert.pem');
      //var hskey  = fs.readFileSync('neto-netoform.rhcloud-key.pem')
      //
      //var options = {
      //    key: hskey,
      //    cert: hscert
      //};
      //
      //var httpsServer = https.createServer(options, self.app);
      //httpsServer.listen(443);
    });
  }


};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var netoCommissionApp = new NetoCommissionApp();
netoCommissionApp.initialize();
netoCommissionApp.start();

