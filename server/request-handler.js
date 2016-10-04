/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won' t work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var stream = [];
var id = 1;
var messagesUrl = '/classes/messages';

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode = 404;
  var body = [];
  var method = request.method;
  var url = request.url;

  var headers = defaultCorsHeaders;
  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  if (request.method === 'OPTIONS' && request.url === messagesUrl) {
    request.on('error', function(err) {
      console.log(err);
    });
    request.on('data', function() {
      console.log('what is happening????');
    });
    request.on('end', function() {
      request.on('error', function(err) {
        console.log(err);
      });
      // console.log('body is ', body);
      statusCode = 200;
      response.writeHead(statusCode, headers);
      response.end('Hello, World!');
    });
  } else if (request.method === 'POST' && request.url === messagesUrl) {
    
    request.on('error', function(err) {
      console.log(err);
    });

    request.on('data', function(chunk) {
      body.push(chunk);
    });

    request.on('end', function() {
      
      // body = Buffer.concat(body).toString();
      console.log('THIS IS OUR BODY ', body);
      request.on('error', function(err) {
        console.log(err);
      });
      statusCode = 201;
      body = JSON.parse(body);
      body['objectId'] = id;
      body['createdAt'] = new Date();
      console.log('now our body is', body);
      id++;
      stream.push(body);
      // .writeHead() writes to the request line and headers of the response,
      // which includes the status and all headers.
      response.writeHead(statusCode, headers);

      // console.log('live long, message well', stream);
      response.end();
    });
  } else if (request.method === 'GET' && request.url === messagesUrl) { 
    request.on('error', function(err) {
      console.log(err);
    });

    request.on('data', function(chunk) {
      body.push(chunk);
    });

    request.on('end', function() {
      request.on('error', function(err) {
        console.log(err);
      });
      statusCode = 200;

      headers['Content-Type'] = 'application/json';

      response.writeHead(statusCode, headers);

      responseBody = {
        headers: headers,
        method: method,
        url: url,
        results: stream
      };
      // console.log('we send stuff back and it is', JSON.stringify(responseBody));
      //console.log('the full big thing', response);
      //response.writeHead(JSON.stringify(responseBody));
      // var test = new Buffer(JSON.stringify(responseBody));
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


