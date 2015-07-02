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

      User.findOne({name: 'Admin'}, function(err, theUser) {
        Poll.find({}).remove(function() {
          Poll.create({
            title: 'Fruits',
            question: 'This is a poll about your favourite fruit.',
            voteOptions: ['Banana', 'Apple', 'Chocolate'],
            owner: theUser._id
          }, {
            title: 'VoteMachine',
            question: 'How would you rate this site?',
            voteOptions: ['Perfect', 'Good', 'Okay', 'At least you tried', 'Worst site ever!!!'],
            owner: theUser._id
          }, {
            title: '1+1',
            question: 'The result of 1+1?',
            voteOptions: ['2','11','10'],
            owner: theUser._id
          });
        });
      });
    }
  );
});
