angular.module('feedback')
.controller('feedbackCtrl', function ($scope, $rootScope, $timeout) {
	
	// console.log("feedbackCtrl called");
	$scope.succeededItems = [];
	$scope.failedItems = [];
	$scope.status = null;
	$scope.successHeading = null;
	$scope.failureHeading = null;
	$scope.subSuccessHeading = null;
	$scope.subFailureHeading = null;
	$scope.feedbackHeading = null;
	$scope.feedback = null;
	
	$rootScope.$on('displayFeedback', function (event, feedbackHeading, feedback) {
		// console.log("Feedback Ctrl on displayFeedback");
		var timeoutPromise = null;
		var delay = 30000;
		$scope.succeededItems = null;
		$scope.failedItems = null;
		$scope.status = null;
		$scope.successHeading = null;
		$scope.failureHeading = null;
		$scope.subSuccessHeading = null;
		$scope.subFailureHeading = null;
		$scope.feedbackHeading = feedbackHeading;
		$scope.feedback = feedback;
		timeoutPromise = $timeout (function () {
			$scope.feedbackHeading = null;
			$scope.feedback = null;
			timeoutPromise = null;
		}, delay);
	});
	
	$rootScope.$on('displayTreeFormatFeedbackData', function (event, status, succeededItems, failedItems, successHeading, failureHeading, subSuccessHeading, subFailureHeading) {
		console.log("Catched tree format");
		var timeoutPromise = null;
		var delay = 30000;
		$scope.feedbackHeading = null;
		$scope.feedback = null;
		$scope.succeededItems = succeededItems;
		$scope.failedItems = failedItems;
		$scope.status = status;
		$scope.successHeading = successHeading;
		$scope.failureHeading = failureHeading;
		$scope.subSuccessHeading = subSuccessHeading;
		$scope.subFailureHeading = subFailureHeading;
		timeoutPromise = $timeout (function () {
			$scope.succeededItems = null;
			$scope.failedItems = null;
			$scope.status = null;
			$scope.successHeading = null;
			$scope.failureHeading = null;
			$scope.subSuccessHeading = null;
			$scope.subFailureHeading = null;
			timeoutPromise = null;
		}, delay);
	});
	
	$scope.cancelMessage = function () {
		$scope.succeededItems = null;
		$scope.failedItems = null;
		$scope.status = null;
		$scope.successHeading = null;
		$scope.failureHeading = null;
		$scope.subSuccessHeading = null;
		$scope.subFailureHeading = null;
		$scope.feedbackHeading = null;
		$scope.feedback = null;
	};
});