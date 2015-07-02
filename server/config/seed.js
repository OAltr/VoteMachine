/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var User = require('../api/user/user.model');
var Poll = require('../api/poll/poll.model');
var Answer = require('../api/answer/answer.model');

var testUserID = new ObjectId();
var adminUserID = new ObjectId();

var pollOneID = new ObjectId();
var pollTwoID = new ObjectId();
var pollThreeID = new ObjectId();

User.find({}).remove(function() {
  User.create({
    _id: testUserID,
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    _id: adminUserID,
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
  });
});

Poll.find({}).remove(function() {
  Poll.create({
    _id: pollOneID,
    title: 'VoteMachine',
    question: 'How would you rate this site?',
    voteOptions: ['Perfect', 'Good', 'Okay', 'At least you tried', 'Worst site ever!!!'],
    owner: adminUserID
  }, {
    _id: pollTwoID,
    title: 'Fruits',
    question: 'This is a poll about your favourite fruit.',
    voteOptions: ['Banana', 'Apple', 'Chocolate'],
    owner: testUserID
  }, {
    _id: pollThreeID,
    title: '1+1',
    question: 'The result of 1+1?',
    voteOptions: ['2','11','10'],
    owner: adminUserID
  }, function() {
    console.log('finished populating polls');
  });
});

Answer.find({}).remove(function() {
  Answer.create({
    answer: 'Okay',
    voter: testUserID,
    poll: pollOneID
  }, {
    answer: 'Good',
    voter: adminUserID,
    poll: pollOneID
  }, {
    answer: 'Banana',
    voter: adminUserID,
    poll: pollTwoID
  }, {
    answer: 'Orange',
    voter: testUserID,
    poll: pollTwoID
  }, {
    answer: '10',
    voter: testUserID,
    poll: pollThreeID
  }, function() {
    console.log('finished populating answers');
  });
});
