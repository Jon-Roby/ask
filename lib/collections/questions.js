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

Meteor.methods({
  questionInsert: function(questionAttributes) {
    check(Meteor.userId(), String);
    check(questionAttributes, {
      title: String,
      question: String
    });

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
      submitted: new Date()
    });

    var questionId = Questions.insert(question);
    return {
      _id:  questionId
    };
  }
});
