var UserFuncs = {
  isMale: function() { if (this.sex === 'M') return true; return false },
  isFemale: function() { if (this.sex === 'F') return true; return false }
}

var UsersController = {
  init: function() {
    $('.container').on('click', '.user-list a', this.getAndRenderUserForm.bind(this))
    $('.container').on('change', '.user-form input', this.patchUser.bind(this))
    this.compileTemplates()
    this.getAndRenderUsers()
  },

  compileTemplates: function() {
    var templateIds = ['user-form', 'user-item', 'icon-success', 'icon-failure']
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
    var inputToUpdate = {}
    inputToUpdate[$(e.target).attr('name')] = $(e.target).val()
    var form = $(e.target).closest('form')

    var self = this

    $.ajax({
      type: 'patch',
      url: form.attr('action'),
      data: inputToUpdate
    }).done(function(data) {
      if (e.target.name === 'name') {
        var anchor = $('a[href="' + form.attr('action') + '"]')
        anchor.text(data.name)
      }
      var template = self._templates['icon-success']
      var $icon = $(template({}))
      $(e.target).siblings('.icon').html('').append($icon)
      $icon.fadeOut(750)
    }).fail(function (xhr) {
      var template = self._templates['icon-failure']
      var $icon = $(template({}))
      $(e.target).siblings('.icon').html('').append($icon)
      $icon.fadeOut(750)
    })
  }
}

$(function() {
  UsersController.init()
})

