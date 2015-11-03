var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var app = express()

var http = require('http')
var httpProxy = require('http-proxy');

var redisClient = redis.createClient(6379, '127.0.0.1', {})

var proxy = httpProxy.createProxyServer({});

http.createServer(function (req, res) {
	
	redisClient.rpoplpush('serversList', 'serversList', function(err, serverAddress) {
		if(err) throw err
		console.log("Routing this request to this server : "+serverAddress);
		proxy.web(req, res, {target: serverAddress})
	})
}).listen(8000);