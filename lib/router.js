Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return Meteor.subscribe('questions');
  }
});

Router.route('/', {name: 'questionsList'});
Router.route('/questions/:_id', {
  name: 'questionPage',
  waitOn: function() {
    return Meteor.subscribe('comments', this.params._id);
  },
  data: function() { return Questions.findOne(this.params._id); }
});

Router.route('/questions/:_id/edit', {
  name: 'questionEdit',
  data: function() { return Questions.findOne(this.params._id); }
});

Router.route('/submit', {name: 'questionSubmit'});

var requireLogin = function() {
  if (!Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

// If a URL is entered with a valid route, but with no data
Router.onBeforeAction('dataNotFound', {only: 'questionPage' });

Router.onBeforeAction(requireLogin, {only: 'questionSubmit' });
