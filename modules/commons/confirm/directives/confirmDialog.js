angular.module('confirm')
.directive('confirmDialog', function () {
	return {
		restrict: 'E',
		controller: 'confirmDialogCtrl',
		templateUrl: 'modules/commons/confirm/views/confirmDialog.html'
	}
})