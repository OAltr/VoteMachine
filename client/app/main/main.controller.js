'use strict';

angular.module('voteMachineApp')
	.controller('MainCtrl', function ($scope, $http, $state, socket, Auth) {
		$scope.isLoggedIn = Auth.isLoggedIn;
		$scope.awesomePolls = [];
		$scope.newPoll = '';

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
			}).success(function(poll) {
				$state.go('edit', {
					pollID: poll._id
				});
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
