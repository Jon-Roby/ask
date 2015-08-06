Template.questionPage.helpers({
  comments: function() {
    return Comments.find({questionId: this._id});
  }
});
