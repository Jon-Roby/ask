Template.questionSubmit.onCreated(function() {
  Session.set('questionSubmitErrors', {});
});

Template.questionSubmit.helpers({
  errorMessage: function(field) {
    return Session.get('questionSubmitErrors')[field];
  },
  errorClass: function(field) {
    return !!Session.get('questionSubmitErrors')[field] ? 'has-error' : '';
  }
});


Template.questionSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    // Use JS for this
    var fullQuestion = {
      title: $(event.target).find('[name=title]').val(),
      question: $(event.target).find('[name=question]').val()
    };

    var errors = validateQuestion(fullQuestion);
    if (errors.title || errors.question)
      return Session.set('questionSubmitErrors', errors);

    Meteor.call('questionInsert', fullQuestion, function(error, result) {
      // display the error to the user and abort
      if (error)
        return throwError(error.reason);

      // show this result but route anyway
      if (result.questionExists)
        throwError("This link has already been posted");

      Router.go('questionPage', {_id: result._id });
    });
  }
});
