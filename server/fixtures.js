if (Questions.find().count() === 0) {
  Questions.insert({
    title: 'Introducing Telescope',
    url: 'http://sachagreif.com/introducing-telescope/'
  });

  Questions.insert({
    title: 'Meteor',
    url: 'http://meteor.com'
  });

  Questions.insert({
    title: 'The Meteor Book',
    url: 'http://themeteorbook.com'
  });
}
