'use strict';

angular.module('voteMachineApp')
	.controller('EditCtrl', function ($scope, $http, $state, Auth) {
		// TODO: redirect if poll dosen't belong to user
		var pollID = $state.params.pollID;

		$scope.poll = {
			title: '42',
			question: 'Is this even a real question?',
			owner: '0',
			voteOptions: ['Yes', 'No'],
			answers: [{answer: 'Yes'},{answer:'No'},{answer:'Yes'}]
		};
		$scope.editPoll = JSON.parse(JSON.stringify($scope.poll));
		$scope.newOption = '';

		$http.get('/api/polls/'+pollID).success(function(thePoll) {
			$scope.poll = thePoll;
			$scope.editPoll = JSON.parse(JSON.stringify(thePoll));
		});

		$scope.pollBelongsToUser = function(poll) {
			return poll.owner === Auth.getCurrentUser()._id;
		};

		$scope.removeVoteOption = function(option) {
			$scope.editPoll.voteOptions =  $scope.editPoll.voteOptions.filter(function(anOption) {
				return anOption !== option;
			});
		};

		$scope.addVoteOption = function(option) {
			if(option === '') {
				return;
			}

			$scope.editPoll.voteOptions.push(option);
			$scope.newOption = '';
		};

		$scope.savePoll = function(poll) {
			if(poll.title === '' || poll.question === '' || poll.voteOptions.length < 2) {
				return;
			}

			$http.patch('/api/polls/'+pollID, {
				title: poll.title,
				question: poll.question,
				voteOptions: poll.voteOptions
			}).success(function(thePoll) {
				$scope.poll = thePoll;
				$scope.editPoll = JSON.parse(JSON.stringify(thePoll));
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
