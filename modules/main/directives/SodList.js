angular.module('main')
.directive('sodList', function () {
	return {
		restrict: 'E',
		controller: 'SodListCtrl',
		templateUrl: 'modules/main/views/SodList.html'
	}
})