Template.questionEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentQuestionId = this._id;

    var questionProperties = {
      title: $(e.target).find('[name=title]').val(),
      question: $(e.target).find('[name=question]').val()
    }

    Questions.update(currentQuestionId, {$set: questionProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason)
      } else {
        Router.go('questionPage', {_id: currentQuestionId });
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentQuestionId = this._id;
      Questions.remove(currentQuestionId);
      Router.go('questionsList');
    }
  }
});