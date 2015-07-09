'use strict';

angular.module('voteMachineApp')
	.factory('Modal', function ($rootScope, $modal) {
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
				 * @param  {Function} del - callback, ran when delete is confirmed
				 * @return {Function}     - the function to open the modal (ex. myModalFn)
				 */
				edit: function(save) {
					save = save || angular.noop;

					/**
					 * Open a delete confirmation modal
					 * @param  {String} name   - name or info to show on modal
					 * @param  {All}           - any additional args are passed staight to del callback
					 */
					return function() {
						var args = Array.prototype.slice.call(arguments),
								poll = args.shift() || {
									title: '42',
									question: 'Is this even a real question?',
									owner: '0',
									voteOptions: ['Yes', 'No'],
									answers: [{answer: 'Yes'},{answer:'No'},{answer:'Yes'}]
								},
								saveModal;

						console.log(poll);

						saveModal = openModal({
							modal: {
								dismissable: true,
								title: 'Edit',
								html: '<div class="form-group">' +
												'<label class="col-sm-2 control-label">Title</label>' +
												'<div class="col-sm-10">' +
													'<input type="text" class="form-control" placeholder="Title" ng-model="editPoll.title">' +
												'</div>' +
											'</div>' +
											'<div class="form-group">' +
												'<label class="col-sm-2 control-label">Question</label>' +
												'<div class="col-sm-10">' +
													'<input type="text" class="form-control" placeholder="Question" ng-model="editPoll.question">' +
												'</div>' +
											'</div>' +
											'<br/>' +
											'<li class="list-group-item" ng-repeat="voteOption in editPoll.voteOptions">' +
												'<strong>{{voteOption}}</strong>' +
												'<a ng-click="removeVoteOption(voteOption)" class="trash"><span class="glyphicon glyphicon-trash pull-right"></span></a>' +
											'</li>' +
											'<form class="poll-form">' +
												'<p class="input-group">' +
													'<input type="text" class="form-control" placeholder="Add a new answer to poll here." ng-model="newOption">' +
													'<span class="input-group-btn">' +
														'<button type="submit" class="btn btn-primary" ng-click="addVoteOption(newOption)">Add New</button>' +
													'</span>' +
												'</p>' +
											'</form>',
								buttons: [{
									classes: 'btn-primary',
									text: 'Save',
									click: function(e) {
										saveModal.close(e);
									}
								}, {
									classes: 'btn-default',
									text: 'Cancel',
									click: function(e) {
										saveModal.dismiss(e);
									}
								}],
								controller: function($scope) {
									console.log('controller');
									$scope.editPoll = poll;
								}
							}
						});

						saveModal.result.then(function(event) {
							save.apply(event, args);
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
