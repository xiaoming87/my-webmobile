'use strict';
var path = require('path');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5

var app = express();
var server = http.Server(app);

var upload = multer(); // for parsing multipart/form-data

// settings
app.set('json spaces', 4);
app.set('x-powered-by', false);

// middleware
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// static middleware
app.use(express.static(path.join(__dirname, 'public')));

// app.post('/profile', upload.array(), function (request, response, next) {
//     console.log(request.body);
//     response.json(request.body);
// });

app.get('/users/all', function(request, response) {
    var users = [
        {
            id: 1, 
            username: 'Ding'
        }, 
        {
            id: 2, 
            username: 'Ming'
        },
        {
            id: 3, 
            username: 'Xiao'
        }
    ];
    response.header('Access-Control-Allow-Origin', '*');    // 允許跨網域存取的網域
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // 允許跨網域存取的方法
    response.header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    
    response.json(users);
});

app.get('*', function(request, response) {
    // response.sendFile(__dirname + '/public/index.html');
    response.send('');
});

var port = 8082 || '3000';
var host = process.env.C9_HOSTNAME || process.env.HOSTNAME || 'localhost';

server.listen(port, function() {
   console.log('server is running on', host, port); 
});

// ----------------------------------/ express
