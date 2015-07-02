'use strict';

angular.module('voteMachineApp')
  .controller('EditCtrl', function ($scope, $http, $state, Auth) {
    // TODO: redirect if poll dosen't belong to user

    $scope.poll = {
      title: '42',
      question: 'Is this even a real question?',
      owner: '0',
      voteOptions: ['Yes', 'No'],
      answers: [{answer: 'Yes'},{answer:'No'},{answer:'Yes'}]
    };

    $scope.editPoll = JSON.parse(JSON.stringify($scope.poll));

    $http.get('/api/polls/'+$state.params.pollID).success(function(thePoll) {
      $scope.poll = thePoll;
      $scope.editPoll = JSON.parse(JSON.stringify(thePoll));
    });

    $scope.pollBelongsToUser = function(poll) {
      return poll.owner === Auth.getCurrentUser()._id;
    };

    $scope.countVotes = function(voteOption) {
      return $scope.poll.answers.filter(function(anAnswer) {
          return anAnswer.answer === voteOption;
        }).length;
    };

    // TODO: make voteOptions available to edit

    $scope.savePoll = function(poll) {
      if(poll.title === '' || poll.question === '') {
        return;
      }

      $http.patch('/api/polls/'+$state.params.pollID, {
        title: poll.title,
        question: poll.question,
        voteOptions: poll.voteOption
      }).success(function(thePoll) {
        $scope.poll = thePoll;
        $scope.editPoll = thePoll;
      });
    };

    $scope.resetPoll = function() {
      $scope.editPoll = JSON.parse(JSON.stringify($scope.poll));
    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id);
      $state.go('polls');
    };
  });
