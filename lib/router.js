Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() { return Meteor.subscribe('questions'); }
});

Router.route('/', {name: 'questionsList'});
Router.route('/questions/:_id', {
  name: 'questionPage',
  data: function() { return Questions.findOne(this.params._id); }
});

// If a URL is entered with a valid route, but with no data
Router.onBeforeAction('dataNotFound', {only: 'questionPage'});
