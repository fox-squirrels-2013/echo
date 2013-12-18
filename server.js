var express = require('express'),
    sio     = require('socket.io'),
    app     = express(),
    server  = require('http').createServer(app),
    request = require('request'),
    io      = sio.listen(server)


var port = process.env.PORT || 8080
console.log("Listening on port", port)
server.listen(port)

// express routes
app.use(express.static(__dirname))
app.get('/echo', echo)

function echo(req, res) {
  var body = JSON.stringify(req.query);
  res.setHeader('Content-Type', 'application/json')
  // res.setHeader('Content-Type', 'text/plain')
  res.setHeader('Content-Length', body.length)
  res.end(body)
}


// socket.io handlers
var numClients = 0
io.sockets.on('connection', clientConnect)
function clientConnect(socket) {
  numClients++
  checkSFWeatherAndUpdateClients()
}

// random messaging to the socket.io clients
periodicallySendRandomNumberToClients()
function periodicallySendRandomNumberToClients() {
  var randomNumber = Math.floor(Math.random()*10+1)
  io.sockets.emit('random-number', randomNumber)

  setTimeout(periodicallySendRandomNumberToClients, 1000)
}

// keep calling the weather API to update the current temperature
if (!process.env.WWO_API_KEY) {
  console.log('ERROR: WWO_API_KEY must be set in your environment.')
  process.exit()
}

var lastTemperature, lastNumClients
checkSFWeatherAndUpdateClients()

function checkSFWeatherAndUpdateClients() {
  var url = 'http://api.worldweatheronline.com/free/v1/weather.ashx?q=San%20Francisco%2C%20CA&format=JSON&extra=&num_of_days=&date=&fx=&cc=&includelocation=&show_comments=&key=' + process.env.WWO_API_KEY

  request(url, function(error, response, body) {
    updateClientsAndScheduleNextCheck(JSON.parse(body))
  })
}

function updateClientsAndScheduleNextCheck(weatherData) {
  console.log(weatherData.data)
  var currentTemperature = parseInt(weatherData.data.current_condition[0].temp_F)
  // if the temperature has changed or new clients have connected, notify them
  if ((currentTemperature != lastTemperature) || (lastNumClients < numClients)) {
    lastTemperature = currentTemperature
    lastNumClients = numClients
    io.sockets.emit('temperature', {
      location: weatherData.data.request[0].query,
      temp_F: weatherData.data.current_condition[0].temp_F,
      temp_C: weatherData.data.current_condition[0].temp_C,
      when: (new Date())
    })
  }

  setTimeout(checkSFWeatherAndUpdateClients, 60000)
}
