angular.module('main')
.directive('dropDown', function () {
	return {
		restrict: 'E',
		scope: false,
		templateUrl: 'modules/main/views/DropDown.html'
	}
})