const http = require('http');

http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type' : 'text/plain'});
    response.end('Hello world!\n');
}).listen(8124);

console.log('Server running at https://127.0.0.1:8124/');