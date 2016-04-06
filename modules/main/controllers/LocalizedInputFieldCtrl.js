angular.module('main')
.controller('LocalizedInputFieldCtrl', function ($scope,$rootScope) {
	// console.log("called");
	var temp = $scope.fieldname;
	// console.log("Fieldname : "+$scope.fieldname);
	temp= temp.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	$scope.titleCaseFieldLabel =  temp;
	// console.log("Title Case :" + $scope.titleCaseFieldLabel);
	$scope.localeFieldsEnabled = false;

	$scope.toggleLocaleFields = function () {
		$scope.localeFieldsEnabled = !$scope.localeFieldsEnabled;
	}

	$rootScope.$on("setNameAsId", function($event,id) {
		// console.log("setNameAsId catched with id : "+id);
		if($scope.fieldname=="name") {
			// console.log("matched");
			$scope.fieldvalues.en = id;			
		}
		// console.log("Eng : "+$scope.fieldvalues.en);
	});
});