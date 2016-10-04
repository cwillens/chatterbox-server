/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won' t work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var fs = require('fs');
//var stream = [];
var id = 1;
var messagesUrl = '/classes/messages';

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode = 404;
  var body = [];
  var method = request.method;
  var url = request.url;

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  if (request.method === 'OPTIONS' && url.indexOf(messagesUrl) > -1) {
    request.on('error', function(err) {
      console.log(err);
    });
    request.on('data', function() {
    });
    request.on('end', function() {
      request.on('error', function(err) {
        console.log(err);
      });
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end('Hello, World!');
    });
  } else if (request.method === 'POST' && url.indexOf(messagesUrl) > -1) {
    
    request.on('error', function(err) {
      console.log(err);
    });

    request.on('data', function(chunk) {
      body.push(chunk);
    });

    request.on('end', function() {
      
      // body = Buffer.concat(body).toString();
      request.on('error', function(err) {
        console.log(err);
      });
      statusCode = 201;
      body = JSON.parse(body);
      body['objectId'] = id;
      body['createdAt'] = new Date();
      id++;
      //stream.push(body);
      fs.appendFile('storage.txt', JSON.stringify(body) + '\n', (err) => {
        if (err) {
          console.log(err);
        }
      });

      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.
      response.writeHead(statusCode, headers);

      // console.log('live long, message well', stream);
      response.end(JSON.stringify(id));
    });
  } else if (request.method === 'GET' && url.indexOf(messagesUrl) > -1) { 
    request.on('error', function(err) {
      console.log(err);
    });

    request.on('data', function(chunk) {
    });

    request.on('end', function() {
      request.on('error', function(err) {
        console.log(err);
      });
      statusCode = 200;

      headers['Content-Type'] = 'application/json';

      response.writeHead(statusCode, headers);
      var stream = [];
      
      var textFileData = fs.readFileSync('storage.txt');
      textFileData = textFileData.toString();
      stream = textFileData.split('\n');

      //slice off the empty string at the end of array
      if (stream.length > 0) {
        stream = stream.slice(0, stream.length - 1); 
        if (stream.length > 0) { 
          stream = stream.map(obj => (JSON.parse(obj))); 
        } 
      }

      if (url.indexOf('order') > -1) {
        var sortBy = url.slice(url.indexOf('order') + 6);
        // console.log(sortBy);
        var streamCopy = stream.slice();
        if (sortBy[0] === '-') {
          sortByCopy = sortBy.slice(1);
          streamCopy.sort(function(a, b) {
            return b.objectId - a.objectId;
          });
        }
      }
      streamCopy = streamCopy || stream;

      responseBody = {
        headers: headers,
        method: method,
        url: url,
        results: streamCopy 
      };

      response.end(JSON.stringify(responseBody));
    });
  } else {
    response.writeHead(statusCode, headers);
    response.end();
  }
};


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;


