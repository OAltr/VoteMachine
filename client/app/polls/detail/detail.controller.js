'use strict';

angular.module('voteMachineApp')
  .controller('DetailCtrl', function ($scope, $http, $state, Auth) {
    $scope.poll = {
      title: '42',
      question: 'Is this even a real question?',
      owner: '0',
      voteOptions: ['Yes', 'No'],
      answers: [{answer: 'Yes'},{answer:'No'},{answer:'Yes'}]
    };

    $scope.chartLabels = $scope.poll.voteOptions;
    $scope.chartData = [2, 1];

    $http.get('/api/polls/'+$state.params.pollID).success(function(thePoll) {
      $scope.poll = thePoll;
      $scope.chartLabels = thePoll.voteOptions;
      $scope.chartData = thePoll.voteOptions.map(function(option) {
        return thePoll.answers.filter(function(answer) {
          return answer.answer === option;
        }).length;
      });
    });

    $scope.pollBelongsToUser = function(poll) {
      return poll.owner === Auth.getCurrentUser()._id;
    };

    $scope.countVotes = function(voteOption) {
      return $scope.poll.answers.filter(function(anAnswer) {
          return anAnswer.answer === voteOption;
        }).length;
    };
  });
