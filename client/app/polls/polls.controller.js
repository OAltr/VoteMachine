'use strict';

angular.module('voteMachineApp')
	.controller('PollsCtrl', function ($scope, $http, $state, socket, Auth, Modal) {
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.allPolls = [];
		$scope.newPoll = '';

		var shareModal = Modal.info.share();
		var editModal = Modal.confirm.edit(function(pollID) {
			shareModal('https://votemachine.herokuapp.com/polls/'+pollID);
		});

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

			editModal({
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
			$http.get('/api/polls/'+poll._id).success(function(thePoll) {
				editModal(thePoll);
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
