angular.module('main')
.controller('ValidationIndicatorCtrl', function (SodConstants, $scope, gettext, gettextCatalog) {

	// console.log("validation controller");
	var validationSuccessClass = 'icon-validation-success';
	var validationErrorClass = 'icon-validation-error';
	// Set the class of parent div to add apropriate margins
	var invalidCharsRegex = /[<>,;\"\\+#=/|&\\*\\\\]/g;
	console.log("Validation Success : "+$scope.validationSuccess);
	if($scope.validationSuccess==undefined)console.log("undefined validationSuccess");
	$scope.validationSuccess = false;
	var validationMessage = "";
	$scope.enabled = false;

	var textInputHandler = function (newValue, oldValue) {
		// console.log("textInputHandler called");
		// console.log("Old Value : "+$scope.model);
		if (!$scope.enabled && !angular.equals(newValue, oldValue)) {
			$scope.enabled = true;
		}
		if (angular.isDefined($scope.model) && $scope.model != '') {
			var matches = $scope.model.match(invalidCharsRegex);
			if (angular.isArray(matches) && matches.length > 0) {
				var uniqueMatches = [];
				for (var i = 0; i < matches.length; ++i) {
					var exists = false;
					for (var j = 0; j < uniqueMatches.length; ++j) {
						if (uniqueMatches[j] === matches[i]) {
							exists = true;
							break;
						}
					}
					if (!exists) {
						uniqueMatches.push(matches[i]);
					}
				}
				$scope.validationSuccess = false;
				validationMessage = gettextCatalog.getString(gettext("Invalid characters:"))+"  ";
				for (var i = 0; i < uniqueMatches.length; ++i) {
					validationMessage += uniqueMatches[i];
				}
			} else {
				$scope.validationSuccess = true;
				console.log("success valid : "+$scope.validationSuccess);
			}
		} else {
			$scope.validationSuccess = false;
			validationMessage = "* "+"Required Field";
		}
	};

	var roleValidator = function(newValue, oldValue) {
		if (!$scope.enabled && !angular.equals(newValue, oldValue)) {
			$scope.enabled = true;
		}
		if(angular.isDefined(newValue) && newValue!=null && newValue.id!=null) {
			$scope.validationSuccess = true;
			console.log("success valid : "+$scope.validationSuccess);
		}
		else {
			$scope.validationSuccess = false;
			validationMessage = "* "+"Required field";
		}
	} 

	if($scope.type == undefined || $scope.type == null){
		// console.log("$scope.fieldname ="+$scope.fieldname);
		$scope.type = $scope.fieldname;
	}
	console.log("Type : "+$scope.type);

	switch ($scope.type) {
		case "id":
			$scope.parentClass = 'indicator-text';
			// console.log("id : "+JSON.stringify($scope.model));
			// console.log("id");
			$scope.$watch('model', textInputHandler);
			break;
		// case "name":
		// 	$scope.parentClass = 'indicator-text';
		// 	// console.log("name");
		// 	$scope.$watch('model', textInputHandler);
		// 	break;
		// case "description":
		// 	$scope.parentClass = 'indicator-text';
		// 	// console.log("description");
		// 	$scope.$watch('model', textInputHandler);
		// 	break;
		// case "role":
		// 	$scope.parentClass = 'indicator-text';
		// 	$scope.$watch('model',roleValidator);
		// 	break;
		default :
			break;
	}

	// Returns the corresponding class based on whether validation is success or not
	$scope.getValidationResultClass = function () {
		if ($scope.validationSuccess) {
			return validationSuccessClass;
		} else {
			return validationErrorClass;
		}
	};

	$scope.isValidationSuccess = function () {
		return $scope.validationSuccess;
	};

	$scope.getValidationMessage = function () {
		return validationMessage;
	};
});