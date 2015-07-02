'use strict';

angular.module('voteMachineApp')
  .controller('PollsCtrl', function ($scope, $http, $state, socket, Auth) {
    $scope.allPolls = [];

    $http.get('/api/polls').success(function(allPolls) {
      $scope.allPolls = allPolls;
      socket.syncUpdates('poll', $scope.allPolls);
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

    $scope.choosePoll = function(poll) {
      $state.go('detail', {
        pollID: poll._id
      });
    };

    $scope.editPoll = function(poll) {
      $state.go('edit', {
        pollID: poll._id
      });
    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });
  });
