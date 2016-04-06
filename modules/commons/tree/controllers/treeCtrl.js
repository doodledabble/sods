angular.module('tree')
.controller('treeCtrl', function ($scope, $rootScope, Sod, SodConstants, VariableUtils) {
	
	// var containers = {};
	var rootContainer = {};
	// Sod.getSubContainers(containers);
	if($scope.family==undefined) {
		$scope.loadingList = true;
		Sod.getSubContainers("{}").$promise.then(function(data){
			$scope.containers = data;
			$scope.rootContainerLabel = data.id;
			$scope.family = {"subContainers":[$scope.containers]};
			$scope.loadingList = false;
			// console.log("Family(initial) : "+JSON.stringify($scope.family));
			// console.log("data from treeCtrl : "+JSON.stringify(data));
			// console.log("set family as : "+JSON.stringify($scope.family));
			// console.log("rootContainer  : "+JSON.stringify(rootContainer));
			// containers = data;
		});
	}
	// else {
		// console.log("Family is : "+JSON.stringify($scope.family));
	// }
	
	$scope.getContainers = function(node) {
		var child = null;
		var previousContainers = null;
		
		if(node != null){
			// console.log("Node is : "+JSON.stringify(node));
			child = node.node;
			child.collapsed=!child.collapsed;
			previousContainers = $scope.containers;
			// console.log("previousContainers : "+JSON.stringify(previousContainers));
		}
		
		Sod.getSubContainers(child).$promise.then(function (data) {
			if(previousContainers == null || previousContainers == {}){
				$scope.containers = {};
				$scope.containers.subContainers = [];
				$scope.containers.subContainers = data.subContainers;
				$scope.loadingList = false;
				// $scope.containers = data;
				// console.log("data :"+JSON.stringify(data));
				// console.log("$scope.containers = "+JSON.stringify($scope.containers));
			}else {
				$scope.containers.subContainers = formContainerTree(previousContainers.subContainers, child.id, data.subContainers);
			}
		});
	};
	
	function formContainerTree(containers,selectedContainer,subContainers) {
		angular.forEach(containers, function(container) {
			if(container.id == selectedContainer){
				container.subContainers = subContainers;
			}else if (container.subContainers != null && container.subContainers.length != 0) {
				formContainerTree(container.subContainers,selectedContainer,subContainers);
			}
		})
		return containers;
	}

	$scope.addElement = function (node) {
		$scope.element = node.node;
		if(!VariableUtils.isPresent($scope.element,$scope.approvers)) {
			if($scope.approvers){
				$scope.element.sequence = $scope.approvers.length+1;
			}
			$scope.approvers.push($scope.element);
		}
	};

	$scope.removeElement = function () {
		$scope.element = null;
	};
	
});