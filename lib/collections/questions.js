Questions = new Mongo.Collection('questions');

Questions.allow({
  update: function(userId, question) { return ownsDocument(userId, question); },
  remove: function(userId, question) { return ownsDocument(userId, question); },
});

Questions.deny({
  update: function(userId, question, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'question', 'title').length > 0);
  }
});

Questions.deny({
  update: function(userId, question, fieldNames, modifier) {
    var errors = validateQuestion(modifier.$set);
    return errors.title || errors.question;
  }
});

validateQuestion = function (question) {
  var errors = {};

  if (!question.title)
    errors.title = "Please fill in a headline";

  if (!question.question)
    errors.question =  "Please fill in a URL";

  return errors;
}

Meteor.methods({
  questionInsert: function(questionAttributes) {
    check(this.userId, String);
    check(questionAttributes, {
      title: String,
      question: String
    });

    var errors = validateQuestion(questionAttributes);
    if (errors.title || errors.question)
      throw new Meteor.Error('invalid-question', "You must set a title and URL for your question");

    var questionWithSameLink = Questions.findOne({question: questionAttributes.question});
    if (questionWithSameLink) {
      return {
        questionExists: true,
        _id: questionWithSameLink._id
      }
    }

    var user = Meteor.user();
    var question = _.extend(questionAttributes, {
      userId: user._id,
      author: user.username,
      submitted: new Date(),
      commentsCount: 0,
      upvoters: [],
      votes: 0
    });

    var questionId = Questions.insert(question);

    return {
      _id: questionId
    };
  },

  upvote: function(questionId) {
    check(this.userId, String);
    check(questionId, String);

    var affected = Questions.update({
      _id: questionId,
      upvoters: {$ne: this.userId}
    }, {
      $addToSet: {upvoters: this.userId},
      $inc: {votes: 1}
    });

    if (! affected)
      throw new Meteor.Error('invalid', "You weren't able to upvote that question");
  }
});
