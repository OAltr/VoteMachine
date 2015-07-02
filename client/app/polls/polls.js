'use strict';

angular.module('voteMachineApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('polls', {
        url: '/polls',
        templateUrl: 'app/polls/polls.html',
        controller: 'PollsCtrl'
      });
  });