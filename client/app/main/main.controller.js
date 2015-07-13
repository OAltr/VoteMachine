'use strict';

angular.module('voteMachineApp')
	.controller('MainCtrl', function ($scope, $http, $state, socket, Auth, Modal) {
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.awesomePolls = [];
		$scope.newPoll = '';

		$http.get('/api/polls').success(function(awesomePolls) {
			$scope.awesomePolls = awesomePolls.filter(function(value, index, array) {
				return array.length - index <= 6;
			});
			socket.syncUpdates('poll', $scope.awesomePolls);
		});

		$scope.addPoll = function() {
			if($scope.newPoll === '') {
				return;
			}

			var shareModal = Modal.info.share();
			var editModal = Modal.confirm.edit(function(pollID) {
				shareModal('https://votemachine.herokuapp.com/polls/'+pollID);
			});
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

		$scope.$on('$destroy', function () {
			socket.unsyncUpdates('poll');
		});
	});
