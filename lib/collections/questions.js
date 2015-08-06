Questions = new Mongo.Collection('questions');

Questions.allow({
  update: function(userId, question) { return ownsDocument(userId, question);
  },
  remove: function(userId, question) { return ownsDocument(userId, question);
  },
});

Questions.deny({
  update: function(userId, question, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'title', 'question').length > 0);
  }
});

Questions.deny({
  update: function(userId, question, fieldNames, modifier) {
    var errors = validateQuestion(modifier.$set);
    return errors.title || errors.question;
  }
});

validateQuestion = function(question) {
  var errors = {};
  if (!question.title)
    errors.title = "Please fill in a title";
  if (!question.question)
    errors.question = "Please fill in a question";
  return errors;
}

Meteor.methods({
  questionInsert: function(questionAttributes) {
    check(Meteor.userId(), String);
    check(questionAttributes, {
      title: String,
      question: String
    });

    var errors = validateQuestion(questionAttributes);
    if (errors.title || errors.question)
      throw new Meteor.Error('invalid-question', "You must set a title and a question");

    var questionWithSameLink = Questions.findOne({title: questionAttributes.title});
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
      commentsCount: 0
    });

    var questionId = Questions.insert(question);
    return {
      _id:  questionId
    };
  }
});
