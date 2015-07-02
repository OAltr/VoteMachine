'use strict';

angular.module('voteMachineApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('edit', {
        url: '/polls/:pollID/edit',
        templateUrl: 'app/polls/edit/edit.html',
        controller: 'EditCtrl'
      });
  });