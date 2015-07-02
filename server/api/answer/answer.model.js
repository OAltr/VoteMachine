'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AnswerSchema = new Schema({
  answer: String,
  voter: {type: Schema.ObjectId, ref: 'User'},
  poll: {type: Schema.ObjectId, ref: 'Poll'}
});

module.exports = mongoose.model('Answer', AnswerSchema);
