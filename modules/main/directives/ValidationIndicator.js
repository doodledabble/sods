angular.module('main')
.directive('validationIndicator', function () {
	return {
		scope : {
			model: '=model',
			type: '@type',
			fieldname: '=fieldname',
			validationSuccess: '=result'
		},
		controller: 'ValidationIndicatorCtrl',
		templateUrl: 'modules/main/views/ValidationIndicator.html'
	}
})