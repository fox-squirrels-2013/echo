var express = require('express'),
    app     = express(),
    server  = require('http').createServer(app)


var port = process.env.PORT || 8080
console.log("Listening on port", port)
server.listen(port)
app.use(express.static(__dirname))
app.use(express.bodyParser())
app.get('/echo', echo)
app.get('/users', getUsers)
app.get('/users/:id', getUser)
app.patch('/users/:id', updateUser)

function echo(req, res) {
  var body = JSON.stringify(req.query);
  res.setHeader('Content-Type', 'application/json')
  res.end(body)
}


// Fake user data and simplistic "GET" and "PATCH handlers"
var Users = {
  1: { id: 1, name: 'Anita Neujobb', sex: 'F', age: '26' },
  2: { id: 2, name: 'Ivanna Lernkoding', sex: 'F', age: '32' },
  3: { id: 3, name: 'Ben Hackinalot', sex: 'M', age: '29' }
}

function getUsers(req, res) {
  res.setHeader('Content-Type', 'application/json')
  var body = JSON.stringify(Users)
  res.status(200).end(body)
}

function getUser(req, res) {
  res.setHeader('Content-Type', 'application/json')
  var userId = req.params['id']
  if (userId > Users.length-1) {
    userNotFound(req, res, userId)
  } else {
    var body = JSON.stringify(Users[userId])
    res.status(200).end(body)
  }
}

function updateUser(req, res) {
  res.setHeader('Content-Type', 'application/json')
  var userId = req.params['id']
  if (userId > Users.length-1) {
    userNotFound(req, res, userId)
  } else {
    for (var k in req.body) {
      Users[userId][k] = req.body[k]
    }
    var body = JSON.stringify(Users[userId])
    res.status(200).end(body)
  }
}

function userNotFound(req, res, userId) {
  var body = JSON.stringify({ message: "No user with id " + userId + " exists." })
  res.status(404).end(body)
}
