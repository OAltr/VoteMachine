'use strict';

angular.module('voteMachineApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomePolls = [];

    $http.get('/api/polls').success(function(awesomePolls) {
      $scope.awesomePolls = awesomePolls;
      socket.awesomePolls('poll', $scope.awesomePolls);
    });

    $scope.addPoll = function() {
      if($scope.newPoll === '') {
        return;
      }
      $http.post('/api/polls', { name: $scope.newPoll, info: $scope.newPoll+'?' });
      $scope.newPoll = '';
    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });
  });
