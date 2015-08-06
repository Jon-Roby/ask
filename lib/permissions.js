// check tha the UserId specified owns the documents
ownsDocuments = function(userId, doc) {
  return doc && doc.userId === userId;
}
