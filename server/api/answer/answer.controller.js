'use strict';

var _ = require('lodash');
var Answer = require('./answer.model');

// Get list of answers
exports.index = function(req, res) {
  Answer.find(function (err, answers) {
    if(err) { return handleError(res, err); }
    return res.json(200, answers);
  });
};

// Get a single answer
exports.show = function(req, res) {
  Answer.findById(req.params.id, function (err, answer) {
    if(err) { return handleError(res, err); }
    if(!answer) { return res.send(404); }
    return res.json(answer);
  });
};

// Creates a new answer in the DB.
exports.create = function(req, res) {
  Answer.create(req.body, function(err, answer) {
    if(err) { return handleError(res, err); }
    return res.json(201, answer);
  });
};

// Updates an existing answer in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Answer.findById(req.params.id, function (err, answer) {
    if (err) { return handleError(res, err); }
    if(!answer) { return res.send(404); }
    var updated = _.merge(answer, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, answer);
    });
  });
};

// Deletes a answer from the DB.
exports.destroy = function(req, res) {
  Answer.findById(req.params.id, function (err, answer) {
    if(err) { return handleError(res, err); }
    if(!answer) { return res.send(404); }
    answer.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}