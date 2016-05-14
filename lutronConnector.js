var telnet = require('telnet-client');
const readline = require('readline');
var lutron_login = require('./lutronLogin.json');

var connection = new telnet();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});





var connection_params = {
    host: lutron_login.server,
    port: lutron_login.port,
    shellPrompt: 'GNET>',
    timeout: 0,
    passwordPrompt: 'password',
    username: lutron_login.username,
    password: lutron_login.password,
    ors: '\r\n',
    irs: '\r\n',
    debug: 'true'
  // removeEcho: 4
};

var command_params = {
    shellPrompt: 'GNET>',
    timeout: 0,
    ors: '\r\n',
    irs: '\r\n',
    debug: 'true'
};

//var cmd = 'help';

function sendCommand(cmd) {
    console.log('Sending command...');
    console.log(connection.telnetState);
    connection.exec(cmd, command_params, function (err, response) {
        console.log("---DEBUGGING INFO BELOW---");
        console.log('Error: ' + err);
        console.log('Response: ' + response + '*');
        console.log(connection.telnetState);
    });
}


connection.on('ready', function (prompt) {
        console.log('Connection open!');
        console.log('You can use this as a regular telnet client. Just write any command and hit Enter');
});


connection.on('responseready', function () {
    console.log('RESPONSE_READY!');
})

connection.on('data', function (data) {
    console.log('DATA!: ' + data);
})

connection.on('timeout', function () {
    console.log('TIMEOUT!');
    connection.end();
});

connection.on('close', function () {
    console.log('connection closed');
});

rl.on('line', function (cmd) {
    
    sendCommand(cmd);
});

console.log('Trying to open connection to: ' + connection_params.host);

connection.connect(connection_params);


