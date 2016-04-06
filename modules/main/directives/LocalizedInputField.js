angular.module('main')
.directive('localizedInputfield', function () {
	return {
		restrict : 'E',
		scope: {
			fieldname: '@fieldname',
			fieldvalues: '=',
			result: '='
		},
		controller: 'LocalizedInputFieldCtrl',
		templateUrl: 'modules/main/views/LocalizedInputField.html',
		link: function (scope, element, attrs) {
			$("#sodFieldInput").focus();
		}
	}
})