/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');
var Poll = require('../api/poll/poll.model');

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});

Poll.find({}).remove(function() {
  Poll.create({
    name : 'Fruits',
    info : 'This is a poll about your favourite fruit.'
  }, {
    name : 'VoteMachine',
    info : 'How would you rate this site?'
  }, {
    name : '1+1',
    info : 'The result of 1+1?'
  });
});
