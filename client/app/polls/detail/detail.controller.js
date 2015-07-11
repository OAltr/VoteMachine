'use strict';

angular.module('voteMachineApp')
	.controller('DetailCtrl', function ($scope, $http, $state, socket, Auth, Modal) {
		var pollID = $state.params.pollID;
		$scope.isLoggedIn = Auth.isLoggedIn;

		$scope.poll = {
			_id: pollID,
			title: '42',
			question: 'Is this even a real question?',
			owner: '0',
			voteOptions: ['Yes', 'No'],
			answers: [{answer: 'Yes'},{answer:'No'},{answer:'Yes'}]
		};

		$scope.voteOptions = [];
		$scope.chartLabels = [];
		$scope.chartData = [];
		$scope.userVote = {};
		$scope.customOption = '';

		var sortHelper = function() {
			var thePoll = $scope.poll;
			thePoll.answers = thePoll.answers.filter(function(anAnswer) {
				return anAnswer.poll === pollID;
			});

			var allOptions = thePoll.voteOptions.concat(thePoll.answers.map(function(anAnswer) {
				return anAnswer.answer;
			}));

			$scope.voteOptions = allOptions.filter(function(answer, index, answers) {
				return answers.indexOf(answer) === index;
			}).map(function(answer) {
				var counter = thePoll.answers.filter(function(anAnswer) {
					return anAnswer.answer === answer;
				}).length || 0;

				return [answer, counter];
			});

			$scope.chartLabels = $scope.voteOptions.map(function(option) { return option[0]; });
			$scope.chartData = $scope.voteOptions.map(function(option) { return option[1]; });
		};

		sortHelper();

		var loadData = function() {
			$http.get('/api/polls/'+pollID).success(function(thePoll) {
				$scope.poll = thePoll;

				sortHelper();

				socket.syncUpdates('answer', $scope.poll.answers, function(event, item, array) {
					$scope.poll.answers = array;
					sortHelper();
				});

				$scope.userVote = thePoll.answers.filter(function(answer) {
					return answer.voter === Auth.getCurrentUser()._id;
				})[0] ||{};
			});
		};

		loadData();

		$scope.vote = function(option) {
			if(!Auth.isLoggedIn() || option === '') {
				return;
			}

			$scope.userVote.answer = option;
			$scope.customOption = '';

			if($scope.userVote.hasOwnProperty('_id')) {
				$http.patch('/api/answers/'+$scope.userVote._id, {
					answer: option
				});
			} else {
				$http.post('/api/answers', {
					answer: option,
					voter: Auth.getCurrentUser()._id,
					poll: $scope.poll._id
				}).success(function(answer) {
					$scope.userVote = answer;
				});
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

		$scope.editPoll = function(poll) {
			$http.get('/api/polls/'+poll._id).success(function(thePoll) {
				var editModal = Modal.confirm.edit(function() {
					loadData();
				});
				editModal(thePoll);
			});
		};

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('answer');
		});
	});
