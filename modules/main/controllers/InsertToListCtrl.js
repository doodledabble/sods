angular.module('main')
.controller('InsertToListCtrl', function ($scope, $rootScope, Sod, gettext, gettextCatalog, VariableUtils) {

	var type = 'multi';
	var queryChangeHandler = $scope.$watch('query', function () {
		loadApprover();
	})

	var reloadEventHandler = $rootScope.$on('reloadApprovers', function (event, data) {
		if (data == $scope.name) {
			loadApprover();
		}
	})

	$scope.$on('$destroy', function () {
		queryChangeHandler();
		reloadEventHandler();
	})

	var loadApprover = function () {
		$scope.loadingList = true;
		// console.log("Approvers (InsertToListCtrl): "+JSON.stringify($scope.approvers));
        if ($scope.approvers == null) {
				$scope.approvers = [];
        }
		switch ($scope.name) {
			case 'groups':
				$scope.source = Sod.getGroups($scope.query);
				break;
			case 'users':
				$scope.source = Sod.getUsers($scope.query);
				break;
			case 'roles':
				$scope.source = Sod.getRoles($scope.query);
		}

		$scope.source.$promise.then(function () {
			$scope.loadingList = false;
		})
	}

	$scope.addToApprover = function (item) {
		if(!VariableUtils.isPresent(item,$scope.approvers)) {
			if($scope.approvers){
				item.sequence = $scope.approvers.length+1;
			}
			$scope.approvers.push(item);
		}
	}

	$scope.showSearch = function () {
		if ($scope.name == 'users' || $scope.name == 'groups' || $scope.name == 'roles') {
			$("#sodApproverSearchField_" + $scope.name).focus();
			return true;
		} else {
			return false;
		}
	}

	$scope.getPlaceholder = function () {
		//return gettextCatalog.getString(gettext("Search in"))+" "+gettextCatalog.getString(gettext($scope.name));
        return "Search in "+$scope.name;
	}

})