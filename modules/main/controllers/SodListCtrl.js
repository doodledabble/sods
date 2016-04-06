angular.module('main')
.controller('SodListCtrl', function ($scope, $rootScope, Sod, VariableUtils, SodConstants, Localization, config, gettext, gettextCatalog) {
	
	$scope.data = {};
	$scope.isPaginationdisabled = true;
	$scope.data.nextIndex = 1;
	$scope.data.pageSize = 13;
	$scope.currentPage = 0;
	$scope.totalPages = 0;
	$scope.sodsSortBy = 'name';
	$scope.sodsOrderBy = 'asc';
	$scope.sodsSortClass = 'glyphicon sort-icon glyphicon-chevron-down';
	var activeSodElement = null;
	
	//Limit the number of approvers displayed in summary page
	var limit = 2;

	//
	var convertApproversToHtml = function (approvers) {
		var html = '';
		if (VariableUtils.isArray(approvers)) {
			for (var i = 0; i < approvers.length && i < limit; ++i) {
				var approver = approvers[i];
				var type = approver.type;
				if (i > 0) {
					html+= ', ';
				}
				html += '<span class="icon-normal icon-normal-' + type + '"></span>';
				html += approver.name;
			}
			if (approvers.length > limit) {
				html += ',...';
			}
		} else {
			html += SodConstants.ERROR_FETCHING_ITEMS;
		}
		return html;
		
	}

	//Load the sodList
	$scope.searchSodsHandler = function() {
		$scope.selectAll = false;
		$scope.sodsToDelete = [];
		$scope.data.sodListLoading = true;
		$scope.data.nextIndex = 1;
		$scope.currentPage = 0;
		$scope.totalPages = 0;
		
		var sods = Sod.getSodList($scope.data.query);
		sods.$promise.then(function (data) {
		 	$scope.data.sodListLoading = false;
			$scope.data.nextIndex = data.nextIndex;
			$scope.data.sodList = data.sodList;
			$scope.isPaginationdisabled=false;

		})
	};
	//For loading the sods when we access the sods url.
	$scope.searchSodsHandler();

	//Load the sodList on the event refreshSodList
	$rootScope.$on('refreshSodList', function () {
		$scope.selectAll = false;
		$scope.sodsToDelete = [];
		$scope.data.sodListLoading = true;
		var sods = Sod.getSodList($scope.data.query);
		sods.$promise.then(function (data) {
		 	$scope.data.sodListLoading = false;
			$scope.currentPage = 0;
			$scope.totalPages = 0;
			$scope.data.nextIndex = data.nextIndex;
			$scope.data.sodList = data.sodList;
		})
	})
	
	 $scope.loadSods = function() {
		if ($scope.data.nextIndex > 0) {
			$scope.selectAll = false;
			$scope.sodsToDelete = [];
			$scope.data.sodListLoading = true;
			var sods = Sod.getSodList($scope.data.query, $scope.sodsOrderBy, $scope.data.nextIndex, $scope.sodsSortBy);
			sods.$promise.then(function (data) {
				$scope.data.sodListLoading = false;
				$scope.isPaginationdisabled =false;
				$scope.data.nextIndex = data.nextIndex;
				$scope.data.sodList = data.sodList;
			})
		}
	};

    $scope.range = function (end) {
        var ret = [];        
        for (var i = 0; i <= end; i++) {
            ret.push(i);
        }               
        return ret;
    };
    
    
    $scope.nextPage = function () {
        if ($scope.data.nextIndex > 0) {
            $scope.currentPage++;
            if ($scope.currentPage > $scope.totalPages) {
            	$scope.totalPages = $scope.currentPage;
            }
            $scope.data.nextIndex = $scope.data.pageSize * $scope.currentPage + 1;
            $scope.loadSods();
        }
        
    };
    
    $scope.previousPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.data.nextIndex = $scope.data.pageSize * $scope.currentPage + 1;
            $scope.loadSods();
        }
        
    };
    
    $scope.setPage = function () {
        $scope.currentPage = this.n;
		$scope.data.nextIndex = $scope.data.pageSize * $scope.currentPage + 1;
        $scope.loadSods();
    };

	// Pass in the sod object (having valid sod.dn)
	// Returns approversArray
	// $scope.getApprovers = function (sod) {
	// 	var approvers = Sod.getApprovers (sod.dn);
	// }


	//Select the sod for editing
	$scope.selectSod = function (sod, event) {
		if($scope.getDummySod()) {
			$rootScope.$emit("cancelCreating");
			$rootScope.$emit("editingSod");
			Sod.unsetNewSod();
			Sod.selectSodForEditing(sod);
			activeSodElement = angular.element(event.currentTarget);
		} else {
		    Sod.unsetNewSod();
			sod = Sod.getSodDetails(sod.id);
			sod.$promise.then(function () {
			console.log("Sod : "+JSON.stringify(sod));
			Sod.selectSodForEditing(sod);
			activeSodElement = angular.element(event.currentTarget);
			})
		}
	}
	
	//Regain focus on the sod name after the Sod Edit Panel collapses 

	$rootScope.$on("FocusOnActiveSod", function () {
		activeSodElement.focus();
	})
	
	//Check if the sod is selected
	$scope.isSelectedSod = function (sod) {
		return Sod.getSelectedSod() == sod.id;
	}

	$scope.sodsToDelete = [];
	
	// toggle selection for a given sod
	$scope.toggleSelection = function toggleSelection(sod) {
		var idx = $scope.sodsToDelete.indexOf(sod);
		//console.log("called to delete");
	    // is currently selected
	    if (idx > -1) {
	    	$scope.sodsToDelete.splice(idx, 1);
	    }
	    // is newly selected
	    else {
	    	$scope.sodsToDelete.push(sod);
	    }
	    
	    if($scope.sodsToDelete.length == $scope.data.sodList.length){
	    	$scope.selectAll = true;
	    }else {
	    	$scope.selectAll = false;
	    }
	    // console.log("SODSTODELETE : "+JSON.stringify($scope.sodsToDelete));

	};
	
	// Check if the Sod is to be deleted 

	$scope.toBeDeleted = function (sod) {
		// var check = $scope.sodsToDelete.indexOf(sod) > -1;
		// console.log("To be deleted ("+sod.name.en+") : "+check);
		// console.log("SODSTODELETE : "+JSON.stringify($scope.sodsToDelete));
		return $scope.sodsToDelete.indexOf(sod) > -1;
	}


	$scope.selectAllSods = function() {
		if($scope.selectAll){
			$scope.selectAll = false;
			$scope.sodsToDelete = [];
		}else{
			$scope.selectAll = true;
			angular.forEach($scope.data.sodList, function (sod) {
				console.log("sod is : "+JSON.stringify(sod));
				var idx = $scope.sodsToDelete.indexOf(sod);
				console.log("Index : "+idx);
				if (idx == -1) {
					$scope.sodsToDelete.push(sod);
			    }
	        });
		}
		// console.log("SODSTODELETE : "+JSON.stringify($scope.sodsToDelete));
	};
	
	$scope.deleteSod = function (sods) {
		// console.log("SODSTODELETE : "+JSON.stringify(sods));
		var message = '';
		if(sods.length == 1){
			message = SodConstants.SOD_DELETE_SINGLE;
		} else {
			message = SodConstants.SOD_DELETE_MULTIPLE;
		}
		$rootScope.$broadcast('confirmDialog', sods, message, SodConstants.SOD_DELETE, SodConstants.SOD_CANCEL, "removeSodsButton");
	};
	
	$scope.refreshCache = function () {
		$scope.selectAll = false;
		$scope.sodsToDelete = [];
		$scope.data.sodListLoading = true;
		$scope.sodsSortBy = 'name';
		$scope.sortOrder = 'asc';
		$scope.sodsSortClass = 'glyphicon sort-icon glyphicon-chevron-down';
		var sods = Sod.getSodList($scope.data.query, $scope.sortOrder, null, $scope.sortBy,true);
		sods.$promise.then(function (data) {
			$scope.data.sodListLoading = false;
			$scope.currentPage = 0;
			$scope.totalPages = 0;
			$scope.data.nextIndex = data.nextIndex;
			$scope.data.sodList = data.sodList;
		})
	};


	$scope.createDummySod = function () {
	    if(Sod.isNewSodPresent()) {
    	    Sod.unsetNewSod();
        }
		$rootScope.$emit("cancelEditing");
		$rootScope.$emit("creatingSod");
		Sod.createDummySod();
	}

	$scope.getDummySod = function () {
		return Sod.getDummySod();
	}

	$scope.sodSelected = function () {
		if ($scope.sodsToDelete.length > 0) {
			return true;
		} else {
			return false;
		}
	}
	
	$scope.Sods = function () {
		if ($scope.sodsOrderBy == 'asc') {
			$scope.sodsOrderBy = 'dsc';
			$scope.sodsSortClass = 'glyphicon sort-icon glyphicon-chevron-up';
		} else {
			$scope.sodsOrderBy = 'asc';	
			$scope.sodsSortClass = 'glyphicon sort-icon glyphicon-chevron-down';
		}
		$scope.data.sodListLoading = true;
		
		var sods = Sod.getSodList($scope.data.query, $scope.sodsOrderBy, $scope.data.nextIndex, $scope.sodsSortBy);

		$scope.selectAll = false;
		sods.$promise.then(function (data) {
			$scope.data.sodListLoading = false;
			$scope.data.sodList = data.sodList;
			$scope.data.nextIndex = data.nextIndex;
		})
	}
	
	$scope.getSortOrderSods = function (sortBy) {
		//console.log("SortBy : "+sortBy);
		if($scope.sodsSortBy == sortBy) {
			if ($scope.sodsOrderBy == 'asc') {
				$scope.sodsOrderBy = 'dsc';
				$scope.sodsSortClass = 'glyphicon sort-icon glyphicon-chevron-up';
			} else {
				$scope.sodsOrderBy = 'asc';	
				$scope.sodsSortClass = 'glyphicon sort-icon glyphicon-chevron-down';
			}
		}
		else {
			$scope.sodsSortBy = sortBy;
		}
		$scope.data.sodListLoading = true;
		
		var sods = Sod.getSodList($scope.data.query, $scope.sodsOrderBy,'',$scope.sodsSortBy);

		$scope.selectAll = false;
		sods.$promise.then(function (data) {
			$scope.data.sodListLoading = false;
			$scope.currentPage = 0;
			$scope.totalPages = 0;
			$scope.data.sodList = data.sodList;
			$scope.data.nextIndex = data.nextIndex;
		})
	}

    $scope.disablePagination = function(){

    	return  $scope.isPaginationdisabled || $scope.data.nextIndex==0;

    }

	$scope.getLocalizedValue = function (values) {
		return Localization.getLocalizedValue(values);
	}

	// Detects Space key press

	//$scope.detectSpace = detectKeys.detectSpace;


$scope.NewSodPresent = function(){
    var value = Sod.isNewSodPresent();
	    return value;
	}

    $scope.getNewSod= function(){
	    return Sod.getNewSod();
	}
	// On cancelling confirm dialog, focus should return back to the "Remove Sods" Button if confirm dialog was triggered by "Remove Sods" Button.

	$rootScope.$on("confirmDialogClosed", function(event, InitialFocusId) {
		if(InitialFocusId=="removeSodsButton"){
			$("#removeSodsButton").focus();
		}
	})
})