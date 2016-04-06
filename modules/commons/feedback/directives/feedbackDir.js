angular.module('feedback')
.directive('feedbackDir', function () {
	return {
		restrict: 'E',
		scope: true,
		controller: 'feedbackCtrl',
		templateUrl: 'modules/commons/feedback/views/feedback.html'
	}
})