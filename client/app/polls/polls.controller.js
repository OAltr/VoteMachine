'use strict';

angular.module('voteMachineApp')
	.controller('PollsCtrl', function ($scope, $http, $state, socket, Auth, Modal) {
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.allPolls = [];
		$scope.newPoll = '';

		$http.get('/api/polls').success(function(allPolls) {
			$scope.allPolls = allPolls;
			socket.syncUpdates('poll', $scope.allPolls);
		});

		$scope.pollBelongsToUser = function(poll) {
			return poll.owner === Auth.getCurrentUser()._id;
		};

		$scope.addPoll = function() {
			if($scope.newPoll === '') {
				return;
			}

			var editModal = Modal.confirm.edit();
			editModal({
				title: $scope.newPoll,
				question: $scope.newPoll+'?',
				voteOptions: ['Yes', 'No'],
				owner: Auth.getCurrentUser()._id
			});
			/*
			$http.post('/api/polls', {
				title: $scope.newPoll,
				question: $scope.newPoll+'?',
				voteOptions: ['Yes', 'No'],
				owner: Auth.getCurrentUser()._id
			}).success(function(poll) {
				$state.go('edit', {
					pollID: poll._id
				});
			});
			*/

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

		$scope.deletePoll = function(thePoll) {
			var deleteModal = Modal.confirm.delete(function(poll) {
				$http.delete('/api/polls/' + poll._id);
			});

			deleteModal(thePoll.title, thePoll);
		};

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('poll');
		});
	});
