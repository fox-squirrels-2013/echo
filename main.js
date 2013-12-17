var UsersController = {
  init: function() {
    $('.container').on('click', '.user-list a', this.getAndRenderUserForm.bind(this))
    // TODO: bind additional event(s) to handle partial updates
    this.getAndRenderUsers()
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
    var $userLink = $($('#user-link').html())
    $userLink.find('a').attr('href', '/users/' + user.id).data('id', user.id).html(user.name)
    $('.user-list').append($userLink)
  },

  getAndRenderUserForm: function(e) {
    e.preventDefault()
    var $userLink = $(e.target)
    $.get($userLink.attr('href'), this.renderUserForm.bind(this))
  },

  renderUserForm: function(user) {
    var $userForm = $($('#user-form').html())
    // we'll use PATCH when we submit via AJAX, but browser needs POST
    $userForm.attr('action', '/users/' + user.id).attr('method', 'post')
    $userForm.find('input[name=name]').val(user.name)
    $userForm.find('input[name=age]').val(parseInt(user.age))
    $userForm.find('input[name=sex][value='+user.sex+']').attr('checked', true)
    $('.edit-area').html('').append($userForm)
  },

  patchUser: function(e) {
    // TODO: implement the code to update the user on the backend
  }
}

$(function() {
  UsersController.init()
})

