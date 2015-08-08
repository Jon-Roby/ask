Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  update: function(userId, doc, fieldNames) {
    return ownsDocument(userId, doc) &&
      fieldNames.length === 1 && fieldNames[0] === 'read';
  }
});

createCommentNotification = function(comment) {
  var question = Questions.findOne(comment.questionId);
  if (comment.userId !== question.userId) {
    Notifications.insert({
      userId: question.userId,
      questionId: question._id,
      commentId: comment._id,
      commenterName: comment.author,
      read: false
    });
  }
};
