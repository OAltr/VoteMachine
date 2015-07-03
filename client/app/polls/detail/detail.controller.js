'use strict';

angular.module('voteMachineApp')
	.controller('DetailCtrl', function ($scope, $http, $state, socket, Auth) {
		$scope.poll = {
			title: '42',
			question: 'Is this even a real question?',
			owner: '0',
			voteOptions: ['Yes', 'No'],
			answers: [{answer: 'Yes'},{answer:'No'},{answer:'Yes'}]
		};

		$scope.voteOptions = [['Yes', 2], ['No', 1]];
		$scope.chartLabels = $scope.voteOptions.map(function(option) { return option[0]; });
		$scope.chartData = $scope.voteOptions.map(function(option) { return option[1]; });

		$scope.userVote = {};

		var loadData = function() {
			$http.get('/api/polls/'+$state.params.pollID).success(function(thePoll) {
				$scope.poll = thePoll;

				var allAnswers = thePoll.answers.map(function(anAnswer) {
					return anAnswer.answer;
				}).concat(thePoll.voteOptions);

				$scope.voteOptions = allAnswers.filter(function(answer, index, answers) {
					return answers.indexOf(answer) === index;
				}).map(function(answer) {
					var counter = thePoll.answers.filter(function(anAnswer) {
						return anAnswer.answer === answer;
					}).length || 0;

					return [answer, counter];
				});

				$scope.chartLabels = $scope.voteOptions.map(function(option) { return option[0]; });
				$scope.chartData = $scope.voteOptions.map(function(option) { return option[1]; });

				$scope.userVote = thePoll.answers.filter(function(answer) {
					return answer.voter === Auth.getCurrentUser()._id;
				})[0] ||{};
			});
		};

		loadData();

		$scope.vote = function(option) {
			$scope.userVote.answer = option;

			if($scope.userVote.hasOwnProperty('_id')) {
				$http.patch('/api/answers/'+$scope.userVote._id, {
					answer: option
				}).success(loadData());
			} else {
				$http.post('/api/answers', {
					answer: option,
					voter: Auth.getCurrentUser()._id,
					poll: $scope.poll._id
				}).success(loadData());
			}
		};

		$scope.pollBelongsToUser = function(poll) {
			return poll.owner === Auth.getCurrentUser()._id;
		};

		$scope.countVotes = function(voteOption) {
			return $scope.poll.answers.filter(function(anAnswer) {
					return anAnswer.answer === voteOption;
				}).length;
		};
	});
