var MyController = {
  echoParams: {
    url: '/echo',
    type: 'get',
    data: 'p1=123&p2[a]=456&p2[b]=789' // don't forget to explain this
  },
  echoDone: function(serverData) {
    console.log("server data", serverData)
  }
}

$(function() {
  $.ajax(MyController.echoParams).done(MyController.echoDone)
})

