var Templates = {
  _cachedTemplates: {},
  render: function(name, data, callback) {
    var source = this._cachedTemplates[name]
    if (source) {
      console.log("template is cached, using cached version")
      this._processTemplate(source, data, callback)
    } else {
      console.log("template is NOT cached, getting it from server")
      var self = this
      $.get("/templates/" + name + ".hbs")
      .done(function(source) {
        console.log(this) // this === the jQuery AJAX object
        console.log(self) // self === Templates 
        self._cachedTemplates[name] = source
        self._processTemplate(source, data, callback)
      })
    }
  },
  _processTemplate: function(source, data, callback) {
    var template = Handlebars.compile(source)
    callback(template(data))
  }
}

function f() {
  console.log(this)
  function g() {
    console.log(this)
    function h() {
      console.log(this)
    }
    h()
  }
  g()
}


function replaceContainer(renderedTemplate) {
  $('.container').html(renderedTemplate)
}

$(function() {

  f()

  $.get("/data", function(data) {
    Templates.render("homepage", data, replaceContainer)
    setTimeout(function() {
      Templates.render("homepage", data, replaceContainer)
      Templates.render("homepage", data, replaceContainer)
      Templates.render("homepage", data, replaceContainer)      
    }, 2000)
  })
  
})
