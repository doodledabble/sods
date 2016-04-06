angular.module('confirm')
.controller('confirmDialogCtrl', function ($scope, $rootScope, Sod, SodConstants, detectKeys) {

	$scope.sods = [];
	$scope.confirmDialogmessage = null;
	$scope.rightButton = null;
	$scope.leftButton = null;
	
	// To reset the focus to initial state on cancelling of confirmDialog

	var sendInitialFocusId = null;

	$rootScope.$on('confirmDialog', function (event, sods, confirmDialogmessage, rightButton, leftButton, InitialFocusId) {
		// console.log("confirmdialog event listened");
		$scope.confirmDialogmessage = confirmDialogmessage;
		// console.log("Message : "+$scope.confirmDialogmessage);
		$scope.sods = sods;
		$scope.rightButton = rightButton;
		$scope.leftButton = leftButton;
		sendInitialFocusId = InitialFocusId;
	});

	$scope.ok = function () {
	  if($scope.rightButton == SodConstants.SOD_DELETE){
		  Sod.deleteSod($scope.sods);
		  Sod.selectSodForEditing(null);
		  Sod.unsetNewSod();
		  $scope.sods = [];
		  $scope.confirmDialogmessage = null;
		  $scope.rightButton = null;
		  $scope.leftButton = null;
	  }
	  if($scope.rightButton == SodConstants.SOD_UPDATE_DISCARD_OK){
	          Sod.selectSodForEditing(null);
	          Sod.unsetNewSod();
      		  $scope.confirmDialogmessage = null;
      		  $scope.rightButton = null;
      		  $scope.leftButton = null;
      }
	};

	$scope.cancel = function () {
	  $scope.sods = [];
	  $scope.confirmDialogmessage = null;
	  $scope.rightButton = null;
	  $scope.leftButton = null;
	  $rootScope.$emit("confirmDialogClosed",sendInitialFocusId);
	};

	$rootScope.$on("closeConfirmDialog", function(event, InitialFocusId) {
		$scope.cancel();
	});

	$scope.focusLeftButton = function () {
		$("#leftButton").focus();
	};

	$scope.focusRightButton = function () {
		$("#rightButton").focus();
	};

	$scope.detectSpace = detectKeys.detectSpace;
	$scope.detectEsc = detectKeys.detectEsc;
	$scope.detectTab = detectKeys.detectTab;
});
