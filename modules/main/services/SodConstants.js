angular.module('main')
.service('SodConstants',function ($window, config, gettext) {
	var getContext = function () {
		return config.context;
	}
	
	var getAuthServerAuthorizeUrl = function () {
		return config.AuthorizeUrl;
	}
	
	var getAuthserverLogoutUrl = function () {
		return config.LogoutUrl;
	}
	
	var getRRAClientId = function () {
		return config.clientId;
	}
	
	var getRRARedirectUrl = function () {
	   return config.redirectUrl;
    }
	
	var GRANT_URL = getAuthServerAuthorizeUrl();
	var REDIRECT_URI = getRRARedirectUrl();
	var CLIENT_ID = getRRAClientId();
	var RESPONSE_TYPE = 'token';
	var LOGOUT_URL = getAuthserverLogoutUrl();


	//var ROLES = 'roles';
	// var ROLE_SUBCONTAINER = 'roleSubContainer';
	// var SELECT_ROLES = 'selectRoles';
	// var ROLES_CONTAINER = gettext('Roles Container');
	// var NAME = gettext('name');
	// var DESCRIPTION = gettext('description');
	
	//Header Values
	var HEADER_NAME = "netiq_idm_rbpm_acsrf";
	var ZERO = "0";
	var NO_CACHE = "no-cache";
	var NO_CACHE_NO_STORE_MUST_REVALIDATE = "no-cache, no-store, must-revalidate";
	var EXPIRES = "Expires";
	var PRAGMA = "Pragma";
	var REFRESH = "REFRESH";
	var DAY_SECONDS = "86400";
	var CACHE_CONTROL = "Cache-Control";

	//APIs

	var REST_ACCESS = getContext() + '/rest/access';
    var REST_CATALOG = getContext() + '/rest/catalog'
	var SOD_API = REST_CATALOG + '/sods';
	var SOD_LIST_API = SOD_API;
	var SODS_BY_ROLES_API = SOD_LIST_API + '/list';
	var UPDATE_SOD_API = SOD_LIST_API + '/sod';
	var SOD_DETAILS_API = SOD_API + '/sod';

	var FULLNAME_API = REST_ACCESS + '/users/fullName';
	var PRIVILEGE_API = REST_ACCESS + '/rob';
	var ROLES_API = REST_CATALOG + '/roles';
    var DEFAULT_APPROVALS_API = REST_CATALOG+'/sods/defaultApprovals';
	// var SUB_CONTAINER_API = REST_ACCESS + '/containers';
	// var ROLE_SUB_CONTAINER_API = SUB_CONTAINER_API + '/container';
	// var ROLE_ROOT_CONTAINER_API = SUB_CONTAINER_API + '/role';
	var USER_LOCALES_API = REST_ACCESS + '/supportedlocales/userlocale';
	var DUMMY_SOD = 'DUMMY_SOD';
    var USERS_API = REST_ACCESS + '/users';
	var GROUPS_API = REST_ACCESS + '/groups';
	var SUB_CONTAINER_API = REST_CATALOG + '/containers/container';

	//Tree Format

	var SOD_SUCCESS_HEADING = gettext('Sod(s) successfully deleted');
	var SOD_FAILURE_HEADING = gettext('Sod(s) failed to delete');
	var SUCCESS = gettext('Success');
	var FAILURE = gettext('Failure');
	var DELETE_SUCCESS = gettext('deleted successfully');

	//Messages
	var SPACE = ' ';
	var SOD_CONST = gettext('sod');
	var SOD_CREATE = gettext('Successfully created');
	var SOD_UPDATE = gettext('Successfully updated');
	var SOD_DELETE_MULTIPLE = gettext('Are you sure you want to delete the selected sods?');
	var SOD_DELETE_SINGLE = gettext('Are you sure you want to delete the selected sod?');
	var SOD_UPDATE_CANCEL = gettext('Are you sure you want to cancel?, changes will be lost');

	//Confirmation dialog button constants
	var SOD_UPDATE_DISCARD_OK = gettext('Discard Changes');
	var SOD_UPDATE_CANCEL = gettext('Are you sure you want to cancel?, changes will be lost');
	
	var SOD_DELETE = gettext('Delete');
	var SOD_CANCEL = gettext('Cancel');
	

	return {
		GRANT_URL: GRANT_URL,
		REDIRECT_URI: REDIRECT_URI,
		CLIENT_ID: CLIENT_ID,
		RESPONSE_TYPE: RESPONSE_TYPE,
		LOGOUT_URL: LOGOUT_URL,
		// ROLES: ROLES,
		// ROLE_SUBCONTAINER: ROLE_SUBCONTAINER,
		// SELECT_ROLES: SELECT_ROLES,
		// ROLES_CONTAINER: ROLES_CONTAINER,
		// NAME: NAME,
		// DESCRIPTION: DESCRIPTION,
		
		//Header Values

		HEADER_NAME: HEADER_NAME,
		ZERO: ZERO,
		NO_CACHE: NO_CACHE,
		NO_CACHE_NO_STORE_MUST_REVALIDATE: NO_CACHE_NO_STORE_MUST_REVALIDATE,
		EXPIRES: EXPIRES,
		PRAGMA: PRAGMA,
		REFRESH: REFRESH,
		DAY_SECONDS: DAY_SECONDS,
		CACHE_CONTROL: CACHE_CONTROL,

		// APIS
		REST_ACCESS: REST_ACCESS,
		SOD_API: SOD_API,
		SOD_LIST_API: SOD_LIST_API,
		SODS_BY_ROLES_API: SODS_BY_ROLES_API,
		UPDATE_SOD_API: UPDATE_SOD_API,
		SOD_DETAILS_API: SOD_DETAILS_API,
		FULLNAME_API: FULLNAME_API,
		PRIVILEGE_API: PRIVILEGE_API,
		ROLES_API: ROLES_API,
		DEFAULT_APPROVALS_API: DEFAULT_APPROVALS_API,
		SUB_CONTAINER_API: SUB_CONTAINER_API,

		// SUB_CONTAINER_API: SUB_CONTAINER_API,
		// ROLE_SUB_CONTAINER_API: ROLE_SUB_CONTAINER_API,
		// ROLE_ROOT_CONTAINER_API: ROLE_ROOT_CONTAINER_API,
		USER_LOCALES_API: USER_LOCALES_API,
		DUMMY_SOD: DUMMY_SOD,
        USERS_API: USERS_API,
        GROUPS_API: GROUPS_API,
        
        //Tree Format

        SOD_SUCCESS_HEADING: SOD_SUCCESS_HEADING,
		SOD_FAILURE_HEADING: SOD_FAILURE_HEADING,
		SUCCESS: SUCCESS,
		FAILURE: FAILURE,
		DELETE_SUCCESS: DELETE_SUCCESS,
        
        //Messages
		
		SPACE: SPACE,
		SOD_CONST: SOD_CONST,
		SOD_CREATE: SOD_CREATE,
		SOD_UPDATE: SOD_UPDATE,
		SOD_DELETE_MULTIPLE: SOD_DELETE_MULTIPLE,
		SOD_DELETE_SINGLE: SOD_DELETE_SINGLE,
		SOD_UPDATE_CANCEL: SOD_UPDATE_CANCEL,

        //Confirmation dialog button constants

        SOD_DELETE: SOD_DELETE,
        SOD_CANCEL: SOD_CANCEL,
        SOD_UPDATE_DISCARD_OK: SOD_UPDATE_DISCARD_OK,
        SOD_UPDATE_CANCEL: SOD_UPDATE_CANCEL

	}

	// Permissions
	/*
	var ROLES = 'roles';
	var RESOURCES = 'resource';
	var PRDS = 'prds';

	var ALL_RESOURCES = 'allResources';
	var RESOURCE_SUBCONTAINER = 'resourceSubContainer';
	var SELECT_RESOURCES = 'selectResources';

	var ALL_PRDS = 'allPrds';
	var SELECT_PRDS = 'selectPrds';

	var ROLE_SUBCONTAINER = 'roleSubContainer';
	var SELECT_ROLES = 'selectRoles';
	
	var ROLES_CONTAINER = gettext('Roles Container');
	var RESOURCES_CONTAINER = gettext('Resource Container');

	// Types
	var RECIPIENTS = gettext('recipients');
	var REQUESTORS = gettext('requesters');
	var MEMBERS = gettext('members');
	var NAME = gettext('name');
	var DESCRIPTION = gettext('description');
	var ALL_USERS = gettext('allUsers');
	var RELATIONSHIP = gettext('relationship');
	var USERS = gettext('users');
	var GROUPS = gettext('groups');

	//Header Values
	var HEADER_NAME = "netiq_idm_rbpm_acsrf";
	var ZERO = "0";
	var NO_CACHE = "no-cache";
	var NO_CACHE_NO_STORE_MUST_REVALIDATE = "no-cache, no-store, must-revalidate";
	var EXPIRES = "Expires";
	var PRAGMA = "Pragma";
	var REFRESH = "REFRESH";
	var DAY_SECONDS = "86400";
	var CACHE_CONTROL = "Cache-Control";

	//APIs

	var REST_ACCESS = getContext() + '/rest/access';
	var SOD_API = REST_ACCESS + '/sods';
	var SOD_LIST_API = SOD_API + '/list';
	var SOD_DETAILS_API = SOD_API + '/sod';
	var FULLNAME_API = REST_ACCESS + '/users/fullName';
	var PERMISSIONS_API = SOD_API + '/sod/permissions';
	var USERS_API = REST_ACCESS + '/users';
	var GROUPS_API = REST_ACCESS + '/groups';
	var RELATIONSHIPS_API = REST_ACCESS + '/relationships';
	var PRIVILEGE_API = REST_ACCESS + '/rob';
	var ROLES_API = SOD_API + '/roles';
	var RESOURCES_API = SOD_API + '/resources';
	var PRDS_API = SOD_API + '/prds';
	var SUB_CONTAINER_API = REST_ACCESS + '/containers';
	var ROLE_SUB_CONTAINER_API = SUB_CONTAINER_API + '/container';
	var PRD_ROOT_CONTAINER_API = SUB_CONTAINER_API + '/prd';
	var RESOURCE_ROOT_CONTAINER_API = SUB_CONTAINER_API + '/resource';
	var ROLE_ROOT_CONTAINER_API = SUB_CONTAINER_API + '/role';
	var SOD_PERMISSIONS_API = SOD_API + '/permissions';
    var USER_LOCALES_API = REST_ACCESS + '/supportedlocales/userlocale';
	var DUMMY_SOD = 'DUMMY_SOD';
	
	//Tree Format
	var SOD_SUCCESS_HEADING = gettext('Sod(s) successfully deleted');
	var SOD_FAILURE_HEADING = gettext('Sod(s) failed to delete');
	var SUCCESS = gettext('Success');
	var FAILURE = gettext('Failure');
	var DELETE_SUCCESS = gettext('deleted successfully');
	var SOD_PERMISSION_REMOVE_SUCCESS_HEADING = gettext('Sod Permission(s) successfully removed');
	var SOD_PERMISSION_REMOVE_FAILURE_HEADING = gettext('Sod Permission(s) failed to remove');
	var SOD_PERMISSION_ADD_SUCCESS_HEADING = gettext('Sod Permission(s) successfully added');
	var SOD_PERMISSION_ADD_FAILURE_HEADING = gettext('Sod Permission(s) failed to add');

	//Messages
	var SPACE = ' ';
	var SOD_CONST = gettext('sod');
	var SOD_CREATE = gettext('Successfully created');
	var SOD_UPDATE = gettext('Successfully updated');
	var SOD_DELETE_MULTIPLE = gettext('Are you sure you want to delete the selected sods?');
	var SOD_DELETE_SINGLE = gettext('Are you sure you want to delete the selected sod?');
	var SOD_UPDATE_CANCEL = gettext('Are you sure you want to cancel?, changes will be lost');
	//Confirmation dialog button constants
	var SOD_UPDATE_DISCARD_OK = gettext('Discard Changes');
	var SOD_DELETE = gettext('Delete');
	var SOD_CANCEL = gettext('Cancel');
	
	//roles
	var PERMISSION_ROLE_LEVEL = gettext('Level10');
	var IT_ROLE_LEVEL = gettext('Level20');
	var BUSINESS_ROLE_LEVEL = gettext('Level30');
	var PERMISSION_ROLE = gettext('Permission Role');
	var IT_ROLE = gettext('IT Role');
	var BUSINESS_ROLE = gettext('Business Role');

	var ERROR_FETCHING_ITEMS = gettext('Error fetching items...');
	var SELECT_RELATIONSHIP = gettext('Select relationship');

	var FIELD_EMPTY = gettext('Field cannot be empty');
	var RELATIONSHIP_NOT_SELECTED = gettext('Relationship not selected');
	var RECIPIENT_LIST_EMPTY = gettext('Recipient list is empty');
	var REQUESTORS_EMPTY = gettext('Requesters cannot be empty');
	
	return {
		SOD_API: SOD_API,
		FULLNAME_API: FULLNAME_API,
		SOD_LIST_API: SOD_LIST_API,
		SOD_DETAILS_API: SOD_DETAILS_API,
		PERMISSIONS_API: PERMISSIONS_API,
		USERS_API: USERS_API,
		GROUPS_API: GROUPS_API,
		RELATIONSHIPS_API: RELATIONSHIPS_API,
		PRIVILEGE_API: PRIVILEGE_API,
		DUMMY_SOD: DUMMY_SOD,
		HEADER_NAME: HEADER_NAME,
		ZERO: ZERO,
		NO_CACHE: NO_CACHE,
		NO_CACHE_NO_STORE_MUST_REVALIDATE: NO_CACHE_NO_STORE_MUST_REVALIDATE,
		EXPIRES: EXPIRES,
		PRAGMA: PRAGMA,
		REFRESH: REFRESH,
		DAY_SECONDS: DAY_SECONDS,
		CACHE_CONTROL: CACHE_CONTROL,
		RECIPIENTS: RECIPIENTS,
		REQUESTORS: REQUESTORS,
		MEMBERS: MEMBERS,
		NAME: NAME,
		DESCRIPTION: DESCRIPTION,
		ALL_USERS: ALL_USERS,
		RELATIONSHIP: RELATIONSHIP,
		SOD_SUCCESS_HEADING: SOD_SUCCESS_HEADING,
		SOD_FAILURE_HEADING: SOD_FAILURE_HEADING,
		SUCCESS: SUCCESS,
		FAILURE: FAILURE,
		SPACE : SPACE,
		SOD_CONST : SOD_CONST,
		SOD_CREATE : SOD_CREATE,
		SOD_UPDATE : SOD_UPDATE,
		ROLES : ROLES,
		RESOURCES : RESOURCES,
		PRDS : PRDS,
		ALL_RESOURCES: ALL_RESOURCES,
		RESOURCE_SUBCONTAINER : RESOURCE_SUBCONTAINER,
		SELECT_RESOURCES : SELECT_RESOURCES,
		ALL_PRDS : ALL_PRDS,
		SELECT_PRDS : SELECT_PRDS,
		ROLE_SUBCONTAINER : ROLE_SUBCONTAINER,
		SELECT_ROLES : SELECT_ROLES,
		ROLES_API : ROLES_API,
		RESOURCES_API : RESOURCES_API,
		PRDS_API : PRDS_API,
		SOD_DELETE : SOD_DELETE,
		SOD_CANCEL : SOD_CANCEL,
		ROLES_CONTAINER : ROLES_CONTAINER,
		RESOURCES_CONTAINER : RESOURCES_CONTAINER,
		ROLE_SUB_CONTAINER_API : ROLE_SUB_CONTAINER_API,
		PRD_ROOT_CONTAINER_API : PRD_ROOT_CONTAINER_API,
		RESOURCE_ROOT_CONTAINER_API : RESOURCE_ROOT_CONTAINER_API,
		ROLE_ROOT_CONTAINER_API : ROLE_ROOT_CONTAINER_API,
		PERMISSION_ROLE_LEVEL : PERMISSION_ROLE_LEVEL,
		IT_ROLE_LEVEL : IT_ROLE_LEVEL,
		BUSINESS_ROLE_LEVEL : BUSINESS_ROLE_LEVEL,
		PERMISSION_ROLE : PERMISSION_ROLE,
		IT_ROLE : IT_ROLE,
		SOD_PERMISSIONS_API : SOD_PERMISSIONS_API,
		BUSINESS_ROLE : BUSINESS_ROLE,
		ERROR_FETCHING_ITEMS : ERROR_FETCHING_ITEMS,
		SELECT_RELATIONSHIP : SELECT_RELATIONSHIP,
		FIELD_EMPTY : FIELD_EMPTY,
		RELATIONSHIP_NOT_SELECTED : RELATIONSHIP_NOT_SELECTED,
		RECIPIENT_LIST_EMPTY : RECIPIENT_LIST_EMPTY,
		REQUESTORS_EMPTY : REQUESTORS_EMPTY,
		GRANT_URL:GRANT_URL,
		REDIRECT_URI:REDIRECT_URI,
		RESPONSE_TYPE:RESPONSE_TYPE,
		CLIENT_ID:CLIENT_ID,
		LOGOUT_URL:LOGOUT_URL,
		SOD_UPDATE_CANCEL : SOD_UPDATE_CANCEL ,
		SOD_UPDATE_DISCARD_OK : SOD_UPDATE_DISCARD_OK,
		SOD_DELETE_MULTIPLE : SOD_DELETE_MULTIPLE,
		SOD_DELETE_SINGLE : SOD_DELETE_SINGLE,
		DELETE_SUCCESS:DELETE_SUCCESS,
		USER_LOCALES_API : USER_LOCALES_API
	}

	*/
})
