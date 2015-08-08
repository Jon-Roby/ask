// check tha the UserId specified owns the documents
ownsDocument = function(userId, doc) {
  return doc && doc.userId === userId;
}
