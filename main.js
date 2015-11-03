var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var args = process.argv;
var portNumber = args[2];

// Server Port Numbers
var serverPorts = [ 3000, 3001, 3002 ];


///////////// WEB ROUTES
	
// Add hook to make it easier to get all visited URLS.
app.use(function(req, res, next) 
{
	console.log(req.method, req.url);
	client.lpush('requests', req.url);
	client.ltrim('requests', 0, 4);
	next(); // Passing the request to the next handler in the stack.
});

app.get('/', function(req, res) {
  res.send('hello world')
})

app.post('/upload',[ multer({ dest: './uploads/'}), function(req, res){

   if( req.files.image )
   {
	   fs.readFile( req.files.image.path, function (err, data) {
	  		if (err) throw err;
	  		var img = new Buffer(data).toString('base64');
	  		client.lpush('image', img);
	  		// console.log(img);
		});
	}

   res.status(204).end()
}]);

app.get('/meow', function(req, res) {
	{
		res.writeHead(200, {'content-type':'text/html'});
		var imageData = client.lpop('image', function(err, imageData){
			if(err) throw err
			if(imageData)
				res.write("<h1>\n<img src='data:my_pic.jpg;base64,"+imageData+"'/>");
			else
				res.write("<h3>No Image found to display</h3>");
			res.end();
		});
	}
});

app.get('/set' , function(req, res) {
	{
		var value = "this message will self-destruct in 10 seconds";
		client.lpush('timer', value);
		client.expire('timer', 10);
		res.send("Key is set. Set to expire within the next 10s");
	}
});

app.get('/get' , function(req, res) {
	{
		client.lpop('timer', function(err, value){
			if(err) throw err
			if(value)
			{
				res.send(value);
			}
			else
			{
				res.send("Sorry. The message has expired !!");
			}
		});
	}
});

app.get('/recent', function(req, res) {
	{
		client.lrange('requests', 0, 4, function(err, recentRequests){
			if(err) throw err
			// console.log("In CallBack() : "+recentRequests);
			res.send(recentRequests);
			res.end();
		});
	}
});

// HTTP SERVER
function startServer(portNumber)
{
var server = app.listen(portNumber, function () {

  var host = server.address().address
  // console.log(host);
  var port = server.address().port
  //console.log(port);
  var serverEndpoint = "http://localhost:"+port;
  client.lpush('serversList', serverEndpoint);
  console.log('Example app listening at '+serverEndpoint);

})
}

serverPorts.forEach(function(port) {
	startServer(port);
})