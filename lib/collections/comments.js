Comments = new Mongo.Collection('comments');

Meteor.methods({
  commentInsert: function(commentAttributes) {
    check(this.userId, String);
    check(commentAttributes, {
      questionId: String,
      body: String
    });
    var user = Meteor.user();
    var question = Questions.findOne(commentAttributes.questionId);
    if (!question)
      throw new Meteor.Error('invalid-comment', 'You must comment on a question');
    comment = _.extend(commentAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date()
    });

    Questions.update(comment.questionId, {$inc: {commentsCount: 1}});
    return Comments.insert(comment);
  }
});
