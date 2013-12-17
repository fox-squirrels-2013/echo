var UserFuncs = {
  isMale: function() { if (this.sex === 'M') return true; return false },
  isFemale: function() { if (this.sex === 'F') return true; return false }
}

var UsersController = {
  init: function() {
    $('.container').on('click', '.user-list a', this.getAndRenderUserForm.bind(this))
    // TODO: bind additional event(s) to handle partial updates
    this.compileTemplates()
    this.getAndRenderUsers()
  },

  compileTemplates: function() {
    var templateIds = ['user-form', 'user-item']
    this._templates = []
    for (var i in templateIds) {
      var source = $("#" + templateIds[i]).html()
      this._templates[templateIds[i]] = Handlebars.compile(source)
    }
  },

  getAndRenderUsers: function() {
    $.get('/users', this.renderUserLinks.bind(this))
  },

  renderUserLinks: function(users) {
    for (var i in users) {
      this.renderUserLink(users[i])
    }
  },

  renderUserLink: function(user) {
    var template = this._templates['user-item']
    $('.user-list').append(template(user))
  },

  getAndRenderUserForm: function(e) {
    e.preventDefault()
    var $userLink = $(e.target)
    $.get($userLink.attr('href'), this.renderUserForm.bind(this))
  },

  renderUserForm: function(user) {
    user.isMale = UserFuncs.isMale
    user.isFemale = UserFuncs.isFemale
    var template = this._templates['user-form']
    $('.edit-area').html('').append(template(user))
  },

  patchUser: function(e) {
    // TODO: implement the code to update the user on the backend
  }
}

$(function() {
  UsersController.init()
})

