Meteor.publish('questions', function() {
  return Questions.find();
});

Meteor.publish('comments', function(questionId) {
  check(questionId, String);
  return Comments.find({questionId: questionId});
});
