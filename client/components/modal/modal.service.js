'use strict';

angular.module('voteMachineApp')
	.factory('Modal', function ($rootScope, $modal, $http) {
		/**
		 * Opens a modal
		 * @param  {Object} scope      - an object to be merged with modal's scope
		 * @param  {String} modalClass - (optional) class(es) to be applied to the modal
		 * @return {Object}            - the instance $modal.open() returns
		 */
		function openModal(scope, modalClass) {
			var modalScope = $rootScope.$new();
			scope = scope || {};
			modalClass = modalClass || 'modal-default';

			angular.extend(modalScope, scope);

			return $modal.open({
				templateUrl: 'components/modal/modal.html',
				windowClass: modalClass,
				scope: modalScope
			});
		}

		// Public API here
		return {

			/* Confirmation modals */
			confirm: {
				/**
				 * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
				 * @param  {Function} cb  - callback, ran when saved
				 * @return {Function}     - the function to open the modal (ex. myModalFn)
				 */
				edit: function(cb) {
					cb = cb || angular.noop;

					/**
					 * Open a delete confirmation modal
					 * @param  {Poll} poll   	 - the poll to edit with the modal
					 */
					return function() {
						var args = Array.prototype.slice.call(arguments),
								poll = args.shift() || {
									title: '',
									question: '',
									voteOptions: []
								},
								saveModal;

						var modalScope = $rootScope.$new();
						var scope = {
							modal: {
								dismissable: true,
								title: 'Edit',
								buttons: [{
									classes: 'btn-primary',
									text: 'Save',
									click: function(e) {
										if(poll.title === '' || poll.question === '' || poll.voteOptions.length === 0 || !poll.hasOwnProperty('owner')) {
											return;
										}

										if(poll.hasOwnProperty('_id')) {
											$http.patch('/api/polls/'+poll._id, poll).success(function(aPoll) {
												saveModal.close(e);
											});
										} else {
											$http.post('/api/polls', poll).success(function(aPoll) {
												saveModal.close(e);
											});
										}
									}
								}, {
									classes: 'btn-default',
									text: 'Cancel',
									click: function(e) {
										saveModal.dismiss(e);
									}
								}]
							},
							editPoll: poll,
							removeVoteOption: function(option) {
								poll.voteOptions =  poll.voteOptions.filter(function(anOption) {
									return anOption !== option;
								});
							},
							addVoteOption: function(option) {
								if(option === '') {
									return;
								}

								if(poll.voteOptions.indexOf(option)===-1) {
									poll.voteOptions.push(option);
								}

								option = '';
							}
						};

						angular.extend(modalScope, scope);

						saveModal = $modal.open({
							templateUrl: 'components/modal/edit-modal.html',
							windowClass: 'modal-default',
							scope: modalScope
						});

						saveModal.result.then(function(event) {
							cb();
						});
					};
				},

				/**
				 * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
				 * @param  {Function} del - callback, ran when delete is confirmed
				 * @return {Function}     - the function to open the modal (ex. myModalFn)
				 */
				delete: function(del) {
					del = del || angular.noop;

					/**
					 * Open a delete confirmation modal
					 * @param  {String} name   - name or info to show on modal
					 * @param  {All}           - any additional args are passed staight to del callback
					 */
					return function() {
						var args = Array.prototype.slice.call(arguments),
								name = args.shift(),
								deleteModal;

						deleteModal = openModal({
							modal: {
								dismissable: true,
								title: 'Confirm Delete',
								html: '<p>Are you sure you want to delete <strong>' + name + '</strong> ?</p>',
								buttons: [{
									classes: 'btn-danger',
									text: 'Delete',
									click: function(e) {
										deleteModal.close(e);
									}
								}, {
									classes: 'btn-default',
									text: 'Cancel',
									click: function(e) {
										deleteModal.dismiss(e);
									}
								}]
							}
						}, 'modal-danger');

						deleteModal.result.then(function(event) {
							del.apply(event, args);
						});
					};
				}
			}
		};
	});
