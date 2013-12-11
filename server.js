var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app);


var port = process.env.PORT || 8080;
console.log("Listening on port", port);
server.listen(port);
app.get('/echo', function(req, res){
  var body = JSON.stringify(req.query);
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Length', body.length);
  res.end(body);
});
app.use(express.static(__dirname));
