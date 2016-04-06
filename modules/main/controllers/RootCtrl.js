angular.module('main')
.controller('RootCtrl', function ($scope, $cookies, $http, $rootScope, SodConstants, VariableUtils, gettextCatalog) {
	//The required data for the controller will be stored in this object
	$scope.data = {};
	
	// To check the sections currently open. Used while an Esc key is pressed.
	var isConfirmDialogOpen = false;
	var isCreateSodOpen = false;
	var isEditSodOpen = false;
	$rootScope.isSodFeedback = false;
	$rootScope.isPermissionFeedback = false;
	//To pass the userName to the header
	$rootScope.$watch(function () {
		return $cookies.get('Spiffy_Session');
	}, function () {

		if (typeof $rootScope.data == 'undefined') {
			$rootScope.data = {
				authorized : false,
				admin : false,
				loading: true
			};
		}

		var usernameLoaded = false;
		var privilegeLoaded = false;

		$scope.data.username = '';
		$http.get(SodConstants.FULLNAME_API)
		.success(function (data) {
			if (data != null) {
				$scope.data.username = data.name;
			}
			usernameLoaded = true;
			if (privilegeLoaded) {
				$rootScope.data.loading = false;
			}
		})

		$http.get(SodConstants.PRIVILEGE_API)
		.success(function (data) {			
			if (data == null) {
				return;
			}
			if (angular.isDefined(data.authorized)) {
				$rootScope.data.authorized = (data.authorized == true);
			} else {
				$rootScope.data.authorized = false;
			}
                        
			if (angular.isDefined(data.readOnly)) {
				$rootScope.data.readOnly = (data.readOnly == true);
			} else {
				$rootScope.data.readOnly = false;
			}
			
			if (angular.isDefined(data.isAdmin)) {
				$rootScope.data.admin = (data.isAdmin == true);
			} else {
				$rootScope.data.admin = false;
			}

			$rootScope.data.domains = {};
			if (VariableUtils.isArray(data.domains) && data.domains.length > 0) {
				$rootScope.data.domains = data.domains;
			}

			privilegeLoaded = true;
			if (usernameLoaded) {
				$rootScope.data.loading = false;
			}

			 $http.get(SodConstants.USER_LOCALES_API)
	         .success(function (data) {
	        	  $rootScope.locale = data;
	              // gettextCatalog.setCurrentLanguage(data);
	              // gettextCatalog.loadRemote('i18n/json/SodStringsRsrc_' + data + '.json');
	        })
		})
		
		$rootScope.isAdmin = function () {
			return $rootScope.data.admin;
		}

		$rootScope.isAuthorized = function () {
			return $rootScope.data.authorized;
		}

		$rootScope.isLoading = function () {
			return $rootScope.data.loading;
		}
	});
	
	// Detect Keys

	//$scope.detectSpace = detectKeys.detectSpace;
	//$scope.detectEsc = detectKeys.detectEsc;
	
	$rootScope.$on('confirmDialog', function (event) {
		isConfirmDialogOpen = true;
	});
	
	$rootScope.$on('creatingSod', function (event) {
		isCreateSodOpen = true;
	});
	
	$rootScope.$on('editingSod', function (event) {
		isEditSodOpen = true;
	});

	$rootScope.$on('setSodFeedback', function (event) {
		console.log("setSodFeedback catched");
		$rootScope.isSodFeedback = true;
	});
	
	
	// Close current section when an Esc key is pressed.

	$scope.closeCurrentSection = function () {
		if(isConfirmDialogOpen) {
			$rootScope.$emit("closeConfirmDialog");
			isConfirmDialogOpen = false;
		}
		else if (isEditSodOpen) {
			$rootScope.$emit("cancelEditing");
			isEditSodOpen = false;
		}
		else if (isCreateSodOpen) {
			$rootScope.$emit("cancelCreating");
			isEditSodOpen = false;
		}
	}
});
