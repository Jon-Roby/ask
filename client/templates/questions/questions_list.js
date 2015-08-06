Template.questionsList.helpers({
  questions: function() {
    return Questions.find({}, {sort: {submitted: -1}});
  }
});
