'use strict';

angular.module('voteMachineApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.awesomePolls = [];

    $http.get('/api/polls').success(function(awesomePolls) {
      $scope.awesomePolls = awesomePolls;
      socket.syncUpdates('poll', $scope.awesomePolls);
    });

    $scope.addPoll = function() {
      if($scope.newPoll === '') {
        return;
      }

      $http.post('/api/polls', {
        title: $scope.newPoll,
        question: $scope.newPoll+'?',
        voteOptions: ['Yes', 'No'],
        owner: Auth.getCurrentUser()._id
      });

      $scope.newPoll = '';
    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });
  });
