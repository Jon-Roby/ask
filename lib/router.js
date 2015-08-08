Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return [Meteor.subscribe('notifications')]
  }
});

QuestionsListController = RouteController.extend({
  template: 'questionsList',
  increment: 5,
  questionsLimit: function() {
    return parseInt(this.params.questionsLimit) || this.increment;
  },
  findOptions: function() {
    return {sort: {submitted: -1}, limit: this.questionsLimit()};
  },
  subscriptions: function() {
    this.questionsSub = Meteor.subscribe('questions', this.findOptions());
  },
  questions: function() {
    return Questions.find({}, this.findOptions());
  },
  data: function() {
    var hasMore = this.questions().count() === this.questionsLimit();
    var nextPath = this.route.path({questionsLimit: this.questionsLimit() + this.increment});
    return {
      questions: this.questions(),
      ready: this.questionsSub.ready,
      nextPath: hasMore ? nextPath: null
    };
  }
});

Router.route('/questions/:_id', {
  name: 'questionPage',
  waitOn: function() {
    return [
      Meteor.subscribe('singleQuestion', this.params._id),
      Meteor.subscribe('comments', this.params._id)
    ]
  },
  data: function() { return Questions.findOne(this.params._id); }
});

Router.route('/questions/:_id/edit', {
  name: 'questionEdit',
  waitOn: function() {
    return Meteor.subscribe('singleQuestion', this.params._id);
  },
  data: function() { return Questions.findOne(this.params._id); }
});

Router.route('/submit', {name: 'questionSubmit'});

Router.route('/:questionsLimit?', {
  name: 'questionsList',
});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {only: 'questionPage'});
Router.onBeforeAction(requireLogin, {only: 'questionSubmit'});
