angular.module('main')
.directive('rolesDropdown', function () {
	return {
		restrict: 'E',
		scope: {
			roleslist: '=roleslist',
			roleid: '=roleid',
			selectedrole: '=selectedrole',
			result: '=',
			loading: '=',
			role1visible: '=',
			role2visible: '='
		},
		controller: 'RolesDropDownCtrl',
		templateUrl: 'modules/main/views/RolesDropDown.html'
	}
})