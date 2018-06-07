/*global console*/
var yetify = require('yetify'),
    config = require('getconfig'),
    express = require('express');
    fs = require('fs'),
    sockets = require('./sockets'),
    app     = express(),
    port = parseInt(process.env.PORT || config.server.port, 10),
    server = null;
// Create an http(s) server instance to that socket.io can listen to
if (config.server.secure) {
    server = require('https').Server({
        key: fs.readFileSync(config.server.key),
        cert: fs.readFileSync(config.server.cert),
        ca: [fs.readFileSync(config.server.chain)]
    }, app);
} else {
    server = require('http').Server(app);
}
server.listen(port);
app.use(express.static('public'));
sockets(server, config);

if (config.uid) process.setuid(config.uid);

var httpUrl;
if (config.server.secure) {
    httpUrl = "https://localhost:" + port;
} else {
    httpUrl = "http://localhost:" + port;
}
console.log(yetify.logo() + ' -- signal master is running at: ' + httpUrl);
