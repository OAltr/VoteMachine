'use strict';

angular.module('voteMachineApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('detail', {
        url: '/polls/:pollID',
        templateUrl: 'app/polls/detail/detail.html',
        controller: 'DetailCtrl'
      });
  });