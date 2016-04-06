angular.module('main')
.directive('tagContainer', function () {
	return {
		restrict: 'E',
		scope: {
			approvers: '=approvers'
		},
		controller: 'TagContainerCtrl',
		templateUrl: 'modules/main/views/TagContainer.html'
	}
})