var http = require('http');
var fs = require('fs');
var pb = require('pushbullet');

var app = http.createServer(function(req, res) {
  
    fs.readFile("notify.html", 'utf-8', function (error, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });

}).listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0");

var io = require('socket.io').listen(app);

io.sockets.on('connection', function(socket) {
    
    socket.on('conectar', function(data) {
        var pusher = new pb(data.apiKey);
        var stream = pusher.stream();
        stream.connect();
        
        stream.on('message', function(message) {
            io.sockets.emit("mensagem",{ data: message }); 
        });
        
        stream.on('connect', function() {
            io.sockets.emit("conectou",{ message: "O WebSocket foi aberto" }); 
        });
        
        stream.on('error', function() {
            io.sockets.emit("erro",{ message: "O WebSocket apresentou um erro" });
        });
        
        stream.on('close', function() {
            io.sockets.emit("fechou",{ message: "O WebSocket foi fechado" }); 
        });
    });
    
});