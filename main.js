function updateTemp(data) {
  var $container = $('.container')
  $container.find('.city').text(data.location)
  $container.find('.temp-f').text(data.temp_F)
  $container.find('.temp-c').text(data.temp_C)
  $container.find('.when').text((new Date(data.when)).toString())
}

function updateRandomNumber(num) {
  var $container = $('.container')
  $container.find('.random-number').text(num)
}

$(function() {
  var socket = io.connect('http://localhost');
  socket.on('temperature', updateTemp)
  socket.on('random-number', updateRandomNumber)
})
