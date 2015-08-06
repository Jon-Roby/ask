if (Questions.find().count() === 0) {

  var now = new Date().getTime();

  // Create two users
  var jonId = Meteor.users.insert({
    profile: {name: 'Jon Roby'}
  });

  var jon = Meteor.users.findOne(jonId);

  var matthewId = Meteor.users.insert({
    profile: {name: 'Matthew'}
  });

  var matthew = Meteor.users.findOne(matthewId);

  var addNumbersId = Questions.insert({
    title: 'What is ~',
    userId: jon._id,
    author: jon.profile.name,
    question: 'What does this symbol ~ mean?',
    submitted: new Date(now - 7 * 3600 * 1000),
    commentsCount: 2
  });

  Comments.insert({
    questionId: addNumbersId,
    userId: matthew._id,
    author: matthew.profile.name,
    submitted: new Date(now - 5 * 3600 * 1000),
    body: 'It means not.'
  });

  Comments.insert({
    questionId: addNumbersId,
    userId: jon._id,
    author: jon.profile.name,
    submitted: new Date(now - 3 * 3600 * 1000),
    body: 'Okay. Got it.'
  });


  Questions.insert({
    title: 'Meteor',
    question: 'http://meteor.com',
    commentsCount: 0
  });

  Questions.insert({
    title: 'The Meteor Book',
    question: 'http://themeteorbook.com',
    commentsCount: 0
  });
}
