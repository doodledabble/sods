angular.module('main')
.directive('insertToList', function () {
	return {
		restrict : 'E',
		scope: {
			name: '@name',
			approvers: '=approvers'
		},
		controller: 'InsertToListCtrl',
		templateUrl: 'modules/main/views/InsertToList.html'
	}
})