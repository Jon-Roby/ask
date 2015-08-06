Template.questionSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    // Use JS for this
    var fullQuestion = {
      title: $(event.target).find('[name=title]').val(),
      question: $(event.target).find('[name=question]').val()
    };

    Meteor.call('questionInsert', fullQuestion, function(error, result) {
      // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // show this result but route anyway
      if (result.questionExists)
        alert("This link has already been posted");

      Router.go('questionPage', {_id: result._id });
    });
  }
});
