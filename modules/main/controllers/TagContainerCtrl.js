angular.module('main')
.controller('TagContainerCtrl', function ($scope, $rootScope, VariableUtils) {
	var dropDownVisible = false;
	var dropDownType = 'users';
	$scope.showDropDown = function (value, event) {		
    	console.log("Approvers (TagContainerCtrl): "+JSON.stringify($scope.approvers));
		if (dropDownVisible == false && value == true) {
			dropDownVisible = value;
			$rootScope.emitClickEvent = function (sourceName, event) {
				$rootScope.$emit('clicked', sourceName);
				event.stopPropagation();
			}
		} else if (dropDownVisible == true){
			dropDownVisible = false;
			$rootScope.emitClickEvent = function (sourceName, event) {}
		}
		event.stopPropagation();
	}

	$scope.isDropDownVisible = function () {
		return dropDownVisible;
	}

	$rootScope.$on('clicked', function (event, data) {
		$scope.showDropDown(false, event);
	});

	$scope.removeApprover = function (approver) {
		var approvers = $scope.approvers;
		if (VariableUtils.isArray(approvers)) {
			for (var i = 0; i < approvers.length; ++i) {
				var x = (approvers[i].dn==undefined)?approvers[i].id:approvers[i].dn;
				var y = (approver.dn==undefined)?approver.id:approver.dn;
				if (x==y) {
					approvers.splice(i,1);
					break;
				}
			}
			if(approvers.length>0) {
				for (var j = i; j < approvers.length; ++j) {
					approvers[j].sequence --;
				}
			}
		}
		$scope.selectedApprover = null;
		console.log("Approvers (TagContainerCtrl): "+JSON.stringify($scope.approvers));
	}

	//For LIST inside DROPDOWN

	$scope.getDropDownTabClass = function (type) {
		if (dropDownType == type) {
			return 'active';
		} else {
			return '';
		}
	}

	$scope.isDropDownTypeVisible = function (type) {
		if (dropDownType == type) {
			return true;
		} else {
			return false;
		}
	}

	$scope.setDropDownType = function (type) {
		dropDownType = type;
	}

	$scope.$watch(function () {
		return dropDownType;
	}, function (newValue) {
		$rootScope.$emit('reloadApprovers', newValue);
	})
	//End LIST

	$scope.selectedApprover = null;
	$scope.selectApprover = function(approver) {
		$scope.selectedApprover = approver;
		console.log("selected approver is : "+JSON.stringify(approver));
	}
	$scope.isSelectedApprover = function(approver) {
		if($scope.selectedApprover!=null) {
			//console.log("Selected Approver id : "+$scope.selectedApprover.dn+" and approver id = "+approver.dn);
			var x = (approver.dn==undefined)?approver.id:approver.dn;
			var y = ($scope.selectedApprover.dn==undefined)?$scope.selectedApprover.id:$scope.selectedApprover.dn;
			return (x==y);
		}
		//console.log("Null and approver id : "+approver.dn);
		return false;
	}

	$rootScope.$on("upApprover", function() {
		// if($scope.selectedApprover) {
		// 	console.log("Selected Approver id : "+$scope.selectedApprover.dn);
		// }
		// else {
		// 	console.log("Selected Approver id : null");
		// }
		if($scope.selectedApprover) {
			if (VariableUtils.isArray($scope.approvers)) {
				if($scope.approvers.length>1 && $scope.selectedApprover.sequence != 1) {
					for (var i = 0; i < $scope.approvers.length; ++i) {
						var x = ($scope.approvers[i].dn==undefined)?$scope.approvers[i].id:$scope.approvers[i].dn;
						var y = ($scope.selectedApprover.dn==undefined)?$scope.selectedApprover.id:$scope.selectedApprover.dn;
						if (x==y) {
							break;
						}
					}
					$scope.approvers[i].sequence --;
					// console.log("Sequence for "+$scope.approvers[i].name+" reduced to "+$scope.approvers[i].sequence);
					$scope.approvers[i-1].sequence ++;
					// console.log("Sequence for "+$scope.approvers[i-1].name+" increased to "+$scope.approvers[i-1].sequence);
					var temp = $scope.approvers[i-1];
					$scope.approvers[i-1] = $scope.approvers[i];
					$scope.approvers[i] = temp;
				}
			}
		}
		// console.log("Approvers List (up) : " + JSON.stringify($scope.approvers));
	});
	$rootScope.$on("downApprover", function() {
		// if($scope.selectedApprover) {
		// 	console.log("Selected Approver id : "+$scope.selectedApprover.dn);
		// }
		// else {
		// 	console.log("Selected Approver id : null");
		// }
		if($scope.selectedApprover) {
			if (VariableUtils.isArray($scope.approvers)) {
				if($scope.approvers.length>1 && $scope.selectedApprover.sequence != $scope.approvers.length) {
					for (var i = 0; i < $scope.approvers.length; ++i) {
						var x = ($scope.approvers[i].dn==undefined)?$scope.approvers[i].id:$scope.approvers[i].dn;
						var y = ($scope.selectedApprover.dn==undefined)?$scope.selectedApprover.id:$scope.selectedApprover.dn;
						if (x == y) {
							break;
						}
					}
					$scope.approvers[i].sequence ++;
					// console.log("Sequence for "+$scope.approvers[i].name+" increased to "+$scope.approvers[i].sequence);
					$scope.approvers[i+1].sequence --;
					// console.log("Sequence for "+$scope.approvers[i+1].name+" reduced to "+$scope.approvers[i+1].sequence);
					var temp = $scope.approvers[i];
					$scope.approvers[i] = $scope.approvers[i+1];
					$scope.approvers[i+1] = temp;
				}
			}
		}
		// console.log("Approvers List (down) : " + JSON.stringify($scope.approvers));
	});
})