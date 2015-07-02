'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  title: String,
  question: String,
  voteOptions: [String],
  owner: {type: Schema.ObjectId, ref: 'User'},
  active: {type: Boolean, default: true}
});

module.exports = mongoose.model('Poll', PollSchema);
