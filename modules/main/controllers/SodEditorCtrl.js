angular.module('main')
.controller('SodEditorCtrl', function ($scope,$timeout,$location,$anchorScroll, $rootScope, VariableUtils, Sod, SodConstants, Localization, gettext, gettextCatalog) {
	$scope.data = {
		name: Localization.getLocalizedValue($scope.sod.name),
		// description: Localization.getLocalizedValue($scope.sod.description),
        rolesList: Sod.getRoles(),
        defaultApprovers: Sod.getDefaultApprovers(),
		sod: {
			is_dummy : $scope.sod.is_dummy,
			id: $scope.sod.id,
			name: $scope.sod.name,
			description: $scope.sod.description,
			sodApprovalType: $scope.sod.sodApprovalType,
			isDefaultApproversUsed: $scope.sod.isDefaultApproversUsed,
			roles: ($scope.sod.roles==undefined)?[]:$scope.sod.roles,
            approvers: $scope.sod.approvers,
            approvalQuorum: null
		}
	};

	$scope.role1visible = null;
	$scope.role2visible = null;

	var approvalQuorumPromise = Sod.getApprovalQuorum();
	approvalQuorumPromise.$promise.then(function (data) {
		$scope.data.sod.approvalQuorum = data.approvalQuorum;
		if($scope.data.sod.approvalQuorum!=null) {
			$scope.sod.approvalQuorum = $scope.data.sod.approvalQuorum;
		}
	});

	$scope.approvalType_label = function() {
		return ($scope.data.sod.approvalQuorum)?'Quorum('+$scope.data.sod.approvalQuorum+')':'Serial';
	}

	$scope.isQuorum = function (){
		return ($scope.data.sod.approvalQuorum)?true:false;
	}
    
    // Name change
 //    if($scope.)
	$scope.sod.name = $scope.data.sod.name;

	// Description change

	$scope.sod.description = $scope.data.sod.description;	
    
    // Conflicting Roles change

    $scope.selected_role_1 = ($scope.sod.roles==undefined)?null:$scope.sod.roles[0];
    $scope.selected_role_2 = ($scope.sod.roles==undefined)?null:$scope.sod.roles[1];

    $rootScope.$on("ConflictingRole1_selected",function(event, role){
    	// if($scope.data.sod.conflicting_roles==undefined) {
    	// 	$scope.data.sod.conflicting_roles = [];
    	// }
    	$scope.data.sod.roles[0] = role;
    	$scope.selected_role_1 = $scope.data.sod.roles[0];
    });
    $rootScope.$on("ConflictingRole2_selected",function(event, role){
    	$scope.data.sod.roles[1] = role;
    	$scope.selected_role_2 = $scope.data.sod.roles[1];
    });

    // Approval required selection change

    // $scope.sod.sodApprovalType = $scope.data.sod.sodApprovalType;

    $scope.approvalRequiredOptions = [{
        value: 0,
        label: 'NO'
      }, {
        value: 1,
        label: 'YES'
      }];
    $scope.defaultApprovalOptions = [{
        value: 0,
        label: 'NO'
      }, {
        value: 1,
        label: 'YES'
      }];  

    $scope.approvalRequired = ($scope.data.sod.sodApprovalType=="allowWithWorkflow")?$scope.approvalRequiredOptions[1]:$scope.approvalRequiredOptions[0];
    $scope.approvalRequiredChanged = function (approvalRequired) {
        $scope.approvalRequired = approvalRequired;
        if($scope.approvalRequired.value){
        	$scope.data.sod.sodApprovalType = "allowWithWorkflow";
        	$scope.data.sod.approvers = $scope.sod.approvers;
        }
        else {
        	$scope.data.sod.sodApprovalType = "alwaysAllow";
        	$scope.data.sod.approvers = [];	
        }
    }

	// Default Approver change
	
	$scope.defaultApproval = $scope.data.sod.isDefaultApproversUsed?$scope.defaultApprovalOptions[1]:$scope.defaultApprovalOptions[0];
    $scope.defaultApprovalChanged = function (defaultApproval) {
        $scope.defaultApproval = defaultApproval;
        $scope.data.sod.isDefaultApproversUsed = defaultApproval.value?true:false;
        if($scope.data.sod.isDefaultApproversUsed) {
        	$scope.data.sod.approvers=$scope.data.defaultApprovers;
        }
        else {
        	$scope.data.sod.approvers=$scope.sod.approvers;	
        }
    };


 	// Approvers List Change 
    
    if($scope.data.sod.sodApprovalType == "allowWithWorkflow" && $scope.data.sod.approvers!=undefined && $scope.data.sod.approvers!=null) {
		$scope.sod.approvers = $scope.data.sod.approvers;
    }
	
	// On SOD's ID Change, Copy change to the Name of SOD

	$scope.setNameAsId = function() {
		// console.log("setNameAsId called");
		// $rootScope.$emit("setNameAsId",$scope.sod.id);
	}

	$scope.loadSelectedSod = function (sod) {
		if (!$scope.data.sod.is_dummy) {
			sodObj = Sod.getSodDetails(sod.id);
			sodObj.$promise.then(function () {
				$scope.data.sod.name = sodObj.name;
				$scope.data.sod.description = sodObj.description;
				$scope.data.sod.description = sodObj.description;
				$scope.data.sod.localizedNames = sodObj.localizedNames;
				$scope.data.sod.localizedDescriptions = sodObj.localizedDescriptions;
				$scope.data.sod.roles = sodObj.roles;
				$scope.data.sod.sodApprovalType = sodObj.sodApprovalType;
				$scope.data.sod.isDefaultApproversUsed = sodObj.isDefaultApproversUsed;
				if(sodObj.approvers) {
					$scope.data.sod.approvers = sodObj.approvers;
				}
			});
		}
	}

	$scope.cancelEditing = function () {
		if ($scope.isCreate()) {
			Sod.clearDummySod();
			$("#createSodsButton").focus();
		} else if($scope.isUpdate()){
			var isApproverListChanged = false;
			var isRolesListChanged = false;
			var isSodApprovalTypeChanged = ($scope.data.sod.sodApprovalType==$scope.sod.sodApprovalType)?false:true;
			var isDefaultApproversUsedChanged = ($scope.data.sod.isDefaultApproversUsed==$scope.sod.isDefaultApproversUsed)?false:true;
			if($scope.sod.sodApprovalType == "allowWithWorkflow" && $scope.sod.approvers!=undefined && $scope.sod.approvers!=null) {
				isApproverListChanged = Sod.hasListChanged($scope.sod.approvers,$scope.data.sod.approvers);
			}
			isRolesListChanged = Sod.hasListChanged($scope.sod.roles,$scope.data.sod.roles);
			console.log("Lists : "+JSON.stringify($scope.data.sod.roles)+"\n and \n"+JSON.stringify($scope.sod.roles));
			console.log("Roles List changed :"+isRolesListChanged);
			console.log("Roles List : "+JSON.stringify($scope.data.sod.roles));
			console.log("Approvers List changed :"+isApproverListChanged);
			console.log("Approvers List : "+JSON.stringify($scope.sod.approvers));
			console.log("sodApprovalType changed :"+isSodApprovalTypeChanged);
			console.log("isDefaultApproversUsed changed :"+isDefaultApproversUsedChanged);
			console.log("is form dirty :"+($scope.sodEditorForm != undefined && $scope.sodEditorForm.$dirty));
		   	if(($scope.sodEditorForm != undefined && $scope.sodEditorForm.$dirty) || isApproverListChanged || isRolesListChanged || isSodApprovalTypeChanged || isDefaultApproversUsedChanged){
		   		console.log("OLD SOD : "+JSON.stringify($scope.sod));
		   		console.log("NEW SOD : "+JSON.stringify($scope.data.sod));
				$rootScope.$broadcast('confirmDialog', null, SodConstants.SOD_UPDATE_CANCEL, SodConstants.SOD_UPDATE_DISCARD_OK, SodConstants.SOD_CANCEL, "cancelSodEditButton");
		    } 
		    else {
		     	Sod.selectSodForEditing(null);
		     	Sod.unsetNewSod();
		    }
		} else {
        Sod.selectSodForEditing(null);
        Sod.unsetNewSod();
        $rootScope.$emit("FocusOnActiveSod");
        }
	}

	$scope.deleteSod = function () {
		var dn = $scope.data.sod.id;
		var localizedNames = $scope.data.sod.localizedNames;
		var sod = [{
			dn: dn,
			localizedNames: localizedNames
		}]
		$rootScope.$broadcast('confirmDialog', sod, SodConstants.SOD_DELETE_SINGLE, SodConstants.SOD_DELETE, SodConstants.SOD_CANCEL, "deleteSodButton");
		$scope.cancelEditing;
	}

	$scope.updateSod = function () {
		var validationStatus = Sod.isValidSod($scope.data.sod);
		if (validationStatus.error == false) {
			Sod.updateSod($scope.data.sod).$promise.then(function (data) {
				var feedback = null;
				if(typeof data.Fault != 'undefined'){
					feedback = data.Fault.Reason.Text;
				}else{
					feedback = gettextCatalog.getString(gettext(SodConstants.SOD_UPDATE)) + SodConstants.SPACE + data.name + SodConstants.SPACE + gettextCatalog.getString(gettext(SodConstants.SOD_CONST));
				}
				$rootScope.$emit('displayFeedback', null, feedback);

				if(Sod.isNewSodPresent()){
                    Sod.unsetNewSod();
                    var createdSod = Sod.getSodDetails(data.id);
                    createdSod.$promise.then(function () {
                        Sod.setNewSodPresent(true);
                        Sod.setNewSod(createdSod);
                    });
                }
				// if (typeof data.Fault != 'undefined') {
				// 	var message = {
				// 		class: 'danger',
				// 		text: data.Fault.Reason.Text
				// 	};
				// 	$rootScope.$emit('displayMessage', message);
				// } else {
				// 	var message = {
				// 		class: 'success',
				// 		text: 'Successfully updated Sod : ' + data.name
				// 	};
				// 	$rootScope.$emit('displayMessage', message);
				// }
				$rootScope.$emit('refreshSodList');
			}, function () {
				// var message = {
				// 	class: 'success',
				// 	text: 'Something went wrong while updating the sod'
				// };
				// $rootScope.$emit('displayMessage', message);
			});
		} else {
			// Error handling will go here
			// var message = {
			// 	class: 'success',
			// 	text: validationStatus.message
			// };
			// $rootScope.$emit('displayMessage', message);
		}
	}

	$scope.createSod = function () {
		var validationStatus = Sod.isValidSod($scope.data.sod);
		if (validationStatus.error == false) {
			Sod.createSod($scope.data.sod).$promise.then(function (data) {
				Sod.clearDummySod();
				var feedback = null;
				if(typeof data.Fault != 'undefined'){
					feedback = data.Fault.Reason.Text;
				}else{
					feedback = gettextCatalog.getString(gettext(SodConstants.SOD_CREATE)) + SodConstants.SPACE + data.name + SodConstants.SPACE + gettextCatalog.getString(gettext(SodConstants.SOD_CONST));
				}
				$rootScope.$emit('displayFeedback', null, feedback);
				// if (typeof data.Fault != 'undefined') {
				// 	var message = {
				// 		class: 'danger',
				// 		text: data.Fault.Reason.Text
				// 	};
				// 	$rootScope.$emit('displayMessage', message);
				// } else {
				// 	var message = {
				// 		class: 'success',
				// 		text: 'Successfully Created Sod : ' + data.name
				// 	};
				// 	$rootScope.$emit('displayMessage', message);
				// }
				var createdSod = Sod.getSodDetails(data.id);
                			createdSod.$promise.then(function () {
                				Sod.setNewSod(createdSod);
                                Sod.setNewSodPresent(true);
                			});
				$rootScope.$emit('refreshSodList');

			}, function () {
				// Error handling
				// var message = {
				// 	class: 'success',
				// 	text: 'Something went wrong while creating the new sod'
				// };
				// $rootScope.$emit('displayMessage', message);
			})
		} else {
			// Error handling will go here
			// var message = {
			// 	class: 'success',
			// 	text: validationStatus.message
			// };
			// $rootScope.$emit('displayMessage', message);
		}
	}

	$scope.isCreate = function () {
		if($scope.data.sod.is_dummy) {
			return true;
		}
		return false;
	}

	$scope.isUpdate = function () {
		return (!$scope.data.sod.is_dummy);	
	}

	var idValidChanged = function (newValue, oldValue) {
		console.log("idValidChanged : "+oldValue+" -> "+newValue);
	}


	// // $scope.temp = false;
	// $scope.$watch($scope.idValid,idValidChanged);

	// $scope.idValid = false;
	// $scope.idValid = true;
	// $scope.nameValid = false;
	// $scope.descValid = false;
	// $scope.role1Valid = false;
	// $scope.role2Valid = false;

	$scope.isValidSod = function (idValid) {
		console.log("$scope.idValid (in isValidSod function ) : "+idValid);
		// console.log("Valid : "+($scope.idValid && $scope.nameValid && $scope.descValid && $scope.role1Valid && $scope.role2Valid)+" | id: "+$scope.idValid+", name: "+$scope.nameValid+", desc: "+$scope.descValid+", role1: "+$scope.role1Valid+", role2: "+$scope.role2Valid);
		// return $scope.idValid && $scope.nameValid && $scope.descValid && $scope.role1Valid && $scope.role2Valid;
		return false;
	}



	// Localization support

	$scope.locale = Localization.getLocale();
	$scope.localeNamesEnabled = false;
	$scope.localeDescriptionsEnabled = false;

	$scope.toggleLocaleNames = function () {
		$scope.localeNamesEnabled = !$scope.localeNamesEnabled;
	}

	$scope.toggleLocaleDescriptions = function () {
		$scope.localeDescriptionsEnabled = !$scope.localeDescriptionsEnabled;
	}

	//Whatever changes you make to the current locale, change that in english also
	if ($scope.isCreate()) {

		$scope.$watch(function () {
			return Localization.getLocalizedValue($scope.data.sod.name);
		}, function () {
			$scope.data.sod.name['en'] = Localization.getLocalizedValue($scope.data.sod.name);
		});

		$scope.$watch(function () {
			return Localization.getLocalizedValue($scope.data.sod.description);
		}, function () {
			$scope.data.sod.description['en'] = angular.copy(Localization.getLocalizedValue($scope.data.sod.description));
		});
	}

	// Detects Space key press

	//$scope.detectSpace = detectKeys.detectSpace;

	// Detects ESC key press

	//$scope.detectEsc = detectKeys.detectEsc;
	
	// On cancelling confirm dialog, focus should return back to the "Delete Sod" Button if confirm dialog was triggered by "Delete Sod" Button.

	$rootScope.$on("confirmDialogClosed", function(event, InitialFocusId) {
		if(InitialFocusId=="deleteSodButton"){
			$("#deleteSodButton").focus();
		}
		else if(InitialFocusId=="cancelSodEditButton"){
		$("#updateSodButton").focus();
		}
	});

	// When Editing a sod, close Create Sod section

	$rootScope.$on("cancelCreating", function() {
		$scope.cancelEditing();
	});

	// When Creating a sod, close Edit Sod section
	
	$rootScope.$on("cancelEditing", function() {
        Sod.selectSodForEditing(null);
	});

	$scope.upApprover = function() {
		$rootScope.$emit("upApprover");
	}
	$scope.downApprover = function() {
		$rootScope.$emit("downApprover");
	}

	// $rootScope.$on('selectSubContainer', function (event, subContainer) {
	// 	$scope.
	// });
	// $scope.data.sodRolesLoading = false;
	$rootScope.$on("searchRolesHandler", function($event, query) {
		// console.log("Searching roles for : "+query);
		$scope.data.sodRolesLoading = true;
		// $scope.data.rolesNextIndex = 1;
		var roles = Sod.getRoles(query);
		roles.$promise.then(function (data) {
		 	$scope.data.sodRolesLoading = false;
			// $scope.data.rolesNextIndex = data.nextIndex;
			$scope.data.rolesList = data;
			// console.log("Updated roles list : "+JSON.stringify(data));
		});
	});

});
