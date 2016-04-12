angular.module('main')
.service('Sod', function ($resource, $http, $rootScope, HttpUtils, VariableUtils, SodConstants, Localization, gettext, gettextCatalog) {
	var Sod = $resource('', {}, {

		//This function returns an array of sods
		getSodList: {
			method: 'GET',
			url: SodConstants.SOD_LIST_API + '?q=:query&sortBy=:sodSortBy&sortOrder=:sodSortOrder&nextIndex=:nextIndex&size=13' ,
			params: {query: '*', sodSortBy: 'name', sodSortOrder : 'asc', nextIndex: 1},
			isArray: false,
			transformResponse : HttpUtils.appendTransformation(function (data, headers, status) {
				var sods = {};
				if (VariableUtils.isDefined(data.nextIndex)) {
					sods.nextIndex = data.nextIndex;
				} else {
					sods.nextIndex = 1;
				}
				
				//If success return the list of sods
				var finalList = [];
				// console.log("all sods :"+JSON.stringify(data.sods));
				if (VariableUtils.isArray(data.sods)) {
					var sodsList = data.sods;
					for (var i = 0; i < sodsList.length; ++i) {
						var sod = convertSodToAppFormat(sodsList[i]);
						// Start : Workaround for isDefaultApproversUsed Flag
						if(sod.approvers){
					    	sod.isDefaultApproversUsed = false;
					    }
					    else {
					    	sod.isDefaultApproversUsed = true;
					    }
					    // End : Workaround for isDefaultApproversUsed Flag
						finalList.push(sod);
						// console.log("Pushed :"+JSON.stringify(sod));
					}
				}
				sods.sodList = finalList;
				return sods;
			}, 'response')
		},
		
		getSodDetails: {
			method: 'POST',
			isArray: false,
			url: SodConstants.SOD_DETAILS_API,
			transformResponse : HttpUtils.appendTransformation(function (data, headers, status) {
			    var sod = convertSodToAppFormat(data.sods[0]);
			    if(sod.approvers){
			    	sod.isDefaultApproversUsed = false;
			    }
			    else {
			    	sod.isDefaultApproversUsed = true;
			    }
				return sod;
			}, 'response')
		},

		updateSod: {
			method: 'PUT',
			url: SodConstants.SOD_API,
			transformRequest: HttpUtils.appendTransformation(function (data, headers) {
				var sod = convertSodToBackendFormat(data);
				return sod;

			}, 'request')
		},

		createSod: {
			method: 'POST',
			url: SodConstants.SOD_API,
			transformRequest: HttpUtils.appendTransformation(function (data,headers) {
				console.log("Request data : "+JSON.stringify(data));
				var sod = convertSodToBackendFormat(data);
				console.log("Backend Format : "+JSON.stringify(sod));
				// delete sod.id;
				return sod;
			}, 'request')
		}
	});

	Users = $resource(SodConstants.USERS_API + '?q=:query&size=300&noCache=true', {query: '*'}, {
		getUsers : {
			method: 'GET',
			isArray: true,
			transformResponse: HttpUtils.appendTransformation(function (data,headers, status) {
				var users = [];
				if (VariableUtils.isDefined(data.members)) {
					if (!VariableUtils.isArray(data.members)) {
						data.members = VariableUtils.push(data.members);
					}
					for (var i = 0; i < data.members.length; ++i) {
						var user = data.members[i];
						var customUser = {
							name: user.firstName + ' ' + user.lastName,
							dn: user.dn,
							type: 'user'
						}
						users.push(customUser);
					}
				}
				return users;
			}, 'response')
		}
	});

	Groups = $resource(SodConstants.GROUPS_API + '?q=:query&size=300&noCache=true', {query: '*'}, {
		getGroups : {
			method: 'GET',
			isArray: true,
			transformResponse: HttpUtils.appendTransformation(function (data, headers, status) {
				var groups = [];
				if (VariableUtils.isDefined(data.groups)) {
					if (!VariableUtils.isArray(data.groups)) {
						data.groups = VariableUtils.push(data.groups);
					}
					for (var i = 0; i < data.groups.length; ++i) {
						var group = data.groups[i];
						var customGroup = {
							name: group.description,
							dn: group.dn,
							type: 'group'
						}
						groups.push(customGroup);
					}
				}
				return groups;
			}, 'response')
		}
	});
    
    Roles = $resource(SodConstants.ROLES_API + '?q=:query&sortBy=name&sortOrder=ASC&nextIndex=1&size=15&column=name&column=description', {query: '*'}, {
		getRoles : {
			method: 'GET',
			isArray: true,
			transformResponse: HttpUtils.appendTransformation(function (data, headers, status) {
				var roles = [];
				if (VariableUtils.isDefined(data.roles)) {
					if (!VariableUtils.isArray(data.roles)) {
						data.roles = VariableUtils.push(data.roles);
					}
					for (var i = 0; i < data.roles.length; ++i) {
						var role = data.roles[i];
						var customRole = {
							name: role.name,
                            description: role.description,
							id: role.id,
							type: 'role' // type needed to display in approver list dropdown
						}
						roles.push(customRole);
					}
				}
				// data.roles = roles;
				return roles;
			}, 'response')
		}
	});
    DefaultApprovers = $resource(SodConstants.DEFAULT_APPROVALS_API + '?q=:query', {query: '*'}, {
		getDefaultApprovers : {
			method: 'GET',
			isArray: true,
			transformResponse: HttpUtils.appendTransformation(function (data, headers, status) {
				var approvers = [];
				if (VariableUtils.isDefined(data.approvers)) {
					if (!VariableUtils.isArray(data.approvers)) {
						data.approvers = VariableUtils.push(data.approvers);
					}
					for (var i = 0; i < data.approvers.length; ++i) {
						var approver = data.approvers[i];
						var customApprover = {
							name: approver.name,
                            sequence: approver.sequence
						}
						approvers.push(customApprover);
					}
				}
                approvers.sort(function(a,b) {
                  return a.sequence - b.sequence  
                })
				return data.approvers;
			}, 'response')
		}
	});

	ApprovalQuorum = $resource(SodConstants.DEFAULT_APPROVALS_API + '?q=:query', {query: '*'}, {
		getApprovalQuorum : {
			method: 'GET',
			isArray: false,
			transformResponse: HttpUtils.appendTransformation(function (data, headers, status) {
				return data;
			}, 'response')
		}
	});
    
    Containers = $resource('',{}, {
    	getSubContainers: {
			method: 'POST',
			url: SodConstants.SUB_CONTAINER_API,
			transformResponse: HttpUtils.appendTransformation(function (data, headers, status) {
				//If success
				var container = data;
				container.type = 'container';
				// console.log("data from sub container api : "+JSON.stringify(data));
				//Populate the container details
				// container.id 
				if(container.subContainers) {
					for(i=0; i< container.subContainers.length; i++) {
						container.subContainers[i].type='container';
					}
				}
				return container;
			}, 'response')
		}
    });
	var deleteSod = function (sodList) {
		$rootScope.$emit('setSodFeedback');
		sodList = [{"id": "cn=sample_sod34,cn=SoDDefs,cn=RoleConfig,cn=AppConfig,cn=User Application Driver,cn=driverset1,o=system"},{"id": "cn=sample_sod_67,cn=SoDDefs,cn=RoleConfig,cn=AppConfig,cn=User Application Driver,cn=driverset1,o=system"}];
		$http({
			method: 'DELETE',
			url: SodConstants.UPDATE_SOD_API,
			data: {
				sods: sodList
			},
			headers: {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, headers, status) {
			$rootScope.$broadcast('refreshSodList');
			var deleteStatus = data.success; 
			var succeededSods = data.succeeded;
			var failedSods = data.failed;
			
			if(data.Fault != null){
				$rootScope.$emit('displayFeedback', null, data.Fault.Reason.Text);
			}else{
				var sodSuccessHeading = gettextCatalog.getString(gettext(SodConstants.SOD_SUCCESS_HEADING));
				var sodFailureHeading = gettextCatalog.getString(gettext(SodConstants.SOD_FAILURE_HEADING));
				var successHeading = gettextCatalog.getString(gettext(SodConstants.SUCCESS));
				var failureHeading = gettextCatalog.getString(gettext(SodConstants.FAILURE));
				// console.log("Succeeded sods :"+JSON.stringify(succeededSods));
				if(succeededSods != null && failedSods != null){
					// deleteStatus = "Succeeded("+succeededSods.length+"), Failed("+failedSods.length+")";
					deleteStatus = 1;
					$rootScope.$emit('displayTreeFormatFeedbackData', deleteStatus, succeededSods, failedSods, sodSuccessHeading, sodFailureHeading, successHeading, failureHeading);
				} else if(succeededSods != null && failedSods == null) {
					console.log("Flag 2");
					if(succeededSods.length == 1) {
						var successMessage = succeededSods[0].name+" "+gettextCatalog.getString(gettext('deleted successfully'));
						// console.log("successMessage : "+successMessage);
						$rootScope.$emit('displayFeedback', null, successMessage);
					}else if(succeededSods.length > 1){
						// deleteStatus = "Succeeded("+succeededSods.length+")";
						deleteStatus = 1;
						$rootScope.$emit('displayTreeFormatFeedbackData', deleteStatus, succeededSods, failedSods, sodSuccessHeading, sodFailureHeading, successHeading, failureHeading);
					}
				} else if(failedSods != null && succeededSods == null) {
					if(failedSods.length == 1){
						var errorDataHeading = gettextCatalog.getString(gettext('We are unable to  delete')) + " " + failedSods[0].name;
						var errorMessage = failedSods[0].reason;
						$rootScope.$emit('displayFeedback', errorDataHeading, errorMessage);
					}else if(failedSods.length > 1) {
						// deleteStatus = "Failed("+failedSods.length+")";
						deleteStatus = 1;
						console.log("Failed Sods : "+JSON.stringify(failedSods));
						$rootScope.$emit('displayTreeFormatFeedbackData', deleteStatus, succeededSods, failedSods, sodSuccessHeading, sodFailureHeading, successHeading, failureHeading);
					}
				}
			}
		})
	}

	var getSodDetails = function(sodID) {
		var sodList = 
			{"sods": 
				[
					{ "id": sodID}
				]
			}
		return Sod.getSodDetails(sodList);
	}
	
	var getSubContainers = function(node) {
		return Containers.getSubContainers(node);
	};

	var convertSodToAppFormat = function (rawSod) {
		var sod = {};
		sod.name = {};
		sod.description = {};

		//Populate the sod details

		sod.id = rawSod.id;
		sod.localizedNames = rawSod.localizedNames;
		sod.localizedDescriptions = rawSod.localizedDescriptions;
		sod.roleLevel = rawSod.roleLevel;
		if(rawSod.approvalQuorum) {
			sod.approvalQuorum = rawSod.approvalQuorum;
		}

		angular.forEach(rawSod.localizedNames, function (localizedName) {
			sod.name[localizedName.locale] = localizedName.name;
		});	
		
		// console.log("Sod Name = "+JSON.stringify(sod.name));
		angular.forEach(rawSod.localizedDescriptions, function (localizedDescription) {
			sod.description[localizedDescription.locale] = localizedDescription.desc;
		});

		var locale = Localization.getLocale();
		if (typeof sod.name[locale] == 'undefined' || sod.name[locale] == '') {
			sod.name[locale] = sod.name.en;
		}

		if (typeof sod.description[locale] == 'undefined' || sod.description[locale] == '') {
			sod.description[locale] = sod.description.en;
		}

        
		//Populate the approvers details
		// sod.approvers = [];
		sod.roles = rawSod.roles;
		sod.sodApprovalType = rawSod.sodApprovalType;
		sod.approvers = (rawSod.approvers==undefined)?[]:rawSod.approvers;
		if(sod.approvers) {
			for(i=0; i<sod.approvers.length;i++){
				sod.approvers[i]['dn'] = sod.approvers[i].id;
				delete sod.approvers[i]["id"];
			}

			// console.log("The Approvers are now : "+JSON.stringify(sod.approvers));
		}
		

		// if(sod.sodApprovalType=="allowWithWorkflow") {
		// 	sod.approvers = rawSod.approvers;
		// }
		// console.log()
		return sod;
	}

	// This function converts the sod object
	var convertSodToBackendFormat = function (data) {
		var sod = {
			id: data.id,
			localizedNames: [],
			localizedDescriptions: [],
			approvers: [],
			roles: []
		};

		if (typeof (Localization.getLocalizedValue(data.name)) != 'undefined' || (Localization.getLocalizedValue(data.name)) != null || (Localization.getLocalizedValue(data.name)) != '') {
			sod.name = Localization.getLocalizedValue(data.name);
		} else {
			sod.name = data.name.en;
		}

		if (typeof (Localization.getLocalizedValue(data.description)) != 'undefined' || (Localization.getLocalizedValue(data.description)) != null || (Localization.getLocalizedValue(data.description)) != '') {
			sod.description = Localization.getLocalizedValue(data.description);
		} else {
			sod.description = data.description.en;
		}

		for (var locale in data.name) {
			var obj = {};
			obj.locale = locale;
			obj.value = data.name[locale];
			if (typeof obj.value != undefined && obj.value != '')
				sod.localizedNames.push(obj);			
		}

		for (var locale in data.description) {
			var obj = {};
			obj.locale = locale;
			obj.value = data.description[locale];
			if (typeof obj.value != undefined && obj.value != '')
				sod.localizedDescriptions.push(obj);
		}

		if(typeof data.isDefaultApproversUsed == 'undefined' || data.isDefaultApproversUsed == null) {
			sod.isDefaultApproversUsed = false;
		}
		else {
			sod.isDefaultApproversUsed = data.isDefaultApproversUsed;
		}
		if(data.sodApprovalType) {
			sod.sodApprovalType = data.sodApprovalType;
		}
		if(data.sodApprovalType=="allowWithWorkflow") {
			if(data.approvers) {
				sod.approvers = data.approvers;
			}
		}

		if(data.approvalQuorum) {
			sod.approvalQuorum = data.approvalQuorum;
		}

		if(data.roles) {
			for(i=0; i<2; ++i) {
				if(data.roles[i]) {
					sod.roles[i]=data.roles[i];					
				}
			}
		}

		return sod;
	}

	var getQueryParam = function (query) {
		if (VariableUtils.isDefined(query) && query != null && query != '') {
			return query;
		} else {
			return '*';
		}
	}
	
	var getNextIndexParam = function (nextIndex) {
		if (VariableUtils.isDefined(nextIndex) && nextIndex != null && nextIndex > 0) {
			return nextIndex;
		} else {
			return 1;
		}
	}
	
	var getSodSortOrderQueryParam = function (sortOrder) {
		if (VariableUtils.isDefined(sortOrder) && sortOrder != null && sortOrder != '') {
			return sortOrder;
		} else {
			return 'asc';
		}
	}

	var getSodSortByQueryParam = function (sortBy) {
		if (VariableUtils.isDefined(sortBy) && sortBy != null && sortBy != '') {
			return sortBy;
		} else {
			return 'name';
		}
	}
	
	var getSodForceRefresh = function (forceRefresh) {
		if (null != forceRefresh && VariableUtils.isDefined(forceRefresh)) {
			return forceRefresh;
		} else {
			return false;
		}
	}

	// Returns a list of sods
	var getSodList = function (query, sodSortOrder, nextIndex, sodSortBy, forceRefresh) {
		query = getQueryParam(query);
		sodSortOrder = getSodSortOrderQueryParam(sodSortOrder);
		nextIndex = getNextIndexParam(nextIndex);
		sodSortBy = getSodSortByQueryParam(sodSortBy);
		//forceRefresh = getSodForceRefresh(forceRefresh);
		var sods = Sod.getSodList({query: query, nextIndex: nextIndex, sodSortOrder: sodSortOrder, sodSortBy: sodSortBy});
		return sods;
	}
	
	var selectedSodID = null;
	
	// Sets or resets a sod's id as selected
	var selectSodForEditing = function (sod) {
		if (VariableUtils.isDefined(sod) && sod != null) {
			if (selectedSodID == sod.id) {
				selectedSodID = null;
			} else {
				selectedSodID = sod.id;
			}
		} else {
			selectedSodID = null;
		}
	}

	// Returns the currently selected sod's id
	var getSelectedSod = function () {
		return selectedSodID;
	}

	// Returns a list of user objects
	var getUsers = function (query) {
		query = getQueryParam(query);
		return Users.getUsers({query: query});
	}

	// Returns a list of group objects
	var getGroups = function (query) {
		query = getQueryParam(query);
		return Groups.getGroups({query: query});
	}
    
    // Returns a list of role objects
	var getRoles = function (query) {
		query = getQueryParam(query);
		return Roles.getRoles({query: query});
	}

    // Returns a list of default Approvers
    
    var getDefaultApprovers = function(query) {
    	query = getQueryParam(query);
        return DefaultApprovers.getDefaultApprovers({query: query});
    }

    // Return the Default Approval Data

    var getApprovalQuorum = function(query) {
    	query = getQueryParam(query);
        return ApprovalQuorum.getApprovalQuorum({query: query});
    }
    
	// Updates the existing sod and refreshes the sodList
	var updateSod = function (sod) {
		$rootScope.$emit('setSodFeedback');
		return Sod.updateSod(sod);
	}

	// This dummy sod is populated in the create new sods editor
	var dummySod = null;
	var createDummySod = function () {
		var sod = {
			is_dummy: 1,
			id: '',
			name: {},
			description: {},
			roles: {},
			sodApprovalType: "alwaysAllow",
			isDefaultApproversUsed: true,
			approvers: []
		};
		dummySod = sod;
	}

	// Returns the dummy sod or null if there is none
	var getDummySod = function () {
		return dummySod;
	}

	// Clears the dummy sod from this service
	var clearDummySod = function () {
		dummySod = null;
	}


	var createSod = function (sod) {
		$rootScope.$emit('setSodFeedback');
		return Sod.createSod(sod);
	}


	/* Pass in a sod object and this function will return validationStatus
	 returns {
		error = 'true/false',
		message = error messages
	}
	*/
	var hasListChanged = function(list1 , list2){
	console.log("lists : "+JSON.stringify(list1)+" \n and \n"+JSON.stringify(list2));
	var hasChanged = false;
    if(list1.length!=list2.length){
		return true;
		} else {
	  		for(i=0; i < list1.length; ++i) {
	  			var x = (list1[i].id==undefined)?JSON.stringify(list1[i].dn).toLowerCase():JSON.stringify(list1[i].id).toLowerCase();
	  			var y = (list2[i].id==undefined)?JSON.stringify(list2[i].dn).toLowerCase():JSON.stringify(list2[i].id).toLowerCase();
	  			if(x!=y){
	  				hasChanged = true;
	  				break;
	  			}
  			}
		}
        return hasChanged;
	}
	var isValidSod = function (sod) {
		var validationStatus = {
			error: false,
			message: ''
		};

		console.log("Validating SOD : "+JSON.stringify(sod));
		if (typeof sod.id == 'undefined' || sod.id == null || sod.id == '') {
			validationStatus.error = true;
			validationStatus.message += gettextCatalog.getString(gettext('Sod ID is not defined'))+'\n';
		}

		if (typeof sod.name == 'undefined' || sod.name == null || sod.name == '' || typeof sod.name.en == 'undefined' || sod.name.en == null || sod.name.en == '') {
			validationStatus.error = true;
			validationStatus.message += gettextCatalog.getString(gettext('Sod Name is not defined'))+'\n';
		}
		if (typeof sod.description == 'undefined' || sod.description == null || sod.description == '' || typeof sod.description.en == 'undefined' || sod.description.en == null || sod.description.en == '') {
			validationStatus.error = true;
			validationStatus.message += gettextCatalog.getString(gettext('Sod Description is not defined'))+'\n';	
		}

		// if(sod.name) {
		// 	if(typeof sod.name.en == 'undefined' || sod.name.en == null || sod.name.en == '') {
		// 		validationStatus.error = true;
		// 		validationStatus.message += gettextCatalog.getString(gettext('Sod Localized Name is not defined'))+'\n';
		// 	}
		// }

		// if(sod.description) {
		// 	if(typeof sod.description.en == 'undefined' || sod.description.en == null || sod.description.en == '') {
		// 		validationStatus.error = true;
		// 		validationStatus.message += gettextCatalog.getString(gettext('Sod Localized Description is not defined'))+'\n';
		// 	}
		// }
		// if(typeof sod.isDefaultApproversUsed == 'undefined' || sod.isDefaultApproversUsed == null || sod.isDefaultApproversUsed == '') {
		// 	validationStatus.error = true;
		// 	validationStatus.message += gettextCatalog.getString(gettext('Sod DefaultApprover choice is not specified'))+'\n';
		// }

		if(typeof sod.roles == 'undefined' || sod.roles == null || Object.keys(sod.roles).length === 0 || typeof sod.roles[0] == 'undefined' || typeof sod.roles[1] == 'undefined') {
			validationStatus.error = true;
			validationStatus.message += gettextCatalog.getString(gettext('Sod Conflicting Roles are not defined'))+'\n';
		} else {
			if(sod.roles[0].id == sod.roles[1].id) {
				validationStatus.error = true;
				validationStatus.message += gettextCatalog.getString(gettext('Same Conflicting Roles selected'))+'\n';
			}
		}

		if(typeof sod.sodApprovalType == 'undefined' || sod.sodApprovalType == null || sod.sodApprovalType == '' || !(sod.sodApprovalType == "alwaysAllow" || sod.sodApprovalType == "allowWithWorkflow")) {
			validationStatus.error = true;
			validationStatus.message += gettextCatalog.getString(gettext('Sod Approval Type is not defined'))+'\n';
		} else {
			if(sod.sodApprovalType == "alwaysAllow") {
				sod.isDefaultApproversUsed = false;
			} else if(sod.sodApprovalType == "allowWithWorkflow"){
				if(typeof sod.isDefaultApproversUsed == 'undefined' || sod.isDefaultApproversUsed == null || sod.isDefaultApproversUsed == '') {
					validationStatus.error = true;
					validationStatus.message += gettextCatalog.getString(gettext('Sod DefaultApprover choice is not defined'))+'\n';
				} else if (sod.isDefaultApproversUsed == true){
					delete sod.approvers;
				}
			}
		}
		if(sod.sodApprovalType == "allowWithWorkflow" && sod.isDefaultApproversUsed == false) {
			if(typeof sod.approvers == 'undefined' || sod.approvers == null ) {
				validationStatus.error = true;
				validationStatus.message += gettextCatalog.getString(gettext('Sod Approvers List is not defined'))+'\n';
			}
		}

		console.log("Validation Error : "+validationStatus.error+", "+validationStatus.message);
		// if (typeof sod.recipients.type == 'undefined' || sod.recipients.type == null) {
		// 	validationStatus.error = true;
		// 	validationStatus.message += gettextCatalog.getString(gettext('Recipient type is not defined'))+'\n';
		// } else {
		// 	if (sod.recipients.type == 'relationship') {
		// 		if (typeof sod.recipients.relationship == 'undefined' || sod.recipients.relationship == null) {
		// 			validationStatus.error = true;
		// 			validationStatus.message += gettextCatalog.getString(gettext('Relationship not defined properly'))+'\n';
		// 		}
		// 	} else if (sod.recipients.type == 'members') {
		// 		if (typeof sod.recipients.members == 'undefined' || sod.recipients.members.length == 0) {
		// 			validationStatus.error = true;
		// 			validationStatus.message += gettextCatalog.getString(gettext('Members are not defined properly'))+'\n';	
		// 		}
		// 	}
		// }
		// if (typeof sod.requestors.members == 'undefined' || sod.requestors.members.length == 0) {
		// 	validationStatus.error = true;
		// 	validationStatus.message += gettextCatalog.getString(gettext('Requesters not defined properly'))+'\n';
		// }
		return validationStatus;
	}

	var newSod  = null;
	var NewSodPresent=false;

	var setNewSod = function(sod){
        newSod = sod;
	};
    var getNewSod = function(){
        return newSod;
        };
     var setNewSodPresent = function(value){
     NewSodPresent= value;
     };
     var isNewSodPresent = function(){
     return NewSodPresent;
     };

    var unsetNewSod = function(){
        setNewSodPresent(false);
        setNewSod(null);
    }

	return {
		getSodList: getSodList,
		getSodDetails:getSodDetails,
        getRoles: getRoles,
        getDefaultApprovers: getDefaultApprovers,
        getApprovalQuorum: getApprovalQuorum,
		selectSodForEditing: selectSodForEditing,
		getSelectedSod: getSelectedSod,
		getSubContainers: getSubContainers,
		deleteSod: deleteSod,
		getUsers: getUsers,
		getGroups: getGroups,
		updateSod: updateSod,
		createDummySod: createDummySod,
		getDummySod: getDummySod,
		clearDummySod: clearDummySod,
		createSod: createSod,
		hasListChanged:hasListChanged,
		isValidSod: isValidSod,
		isNewSodPresent:isNewSodPresent,
        setNewSod: setNewSod,
        getNewSod: getNewSod,
        setNewSodPresent: setNewSodPresent,
        unsetNewSod:unsetNewSod
	}
});
