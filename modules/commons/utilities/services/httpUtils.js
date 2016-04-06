angular.module('utilities')
.service('HttpUtils', function ($http, VariableUtils) {

	/*
	* Description: This function can be used to get an array of transformFunctions
	* transformFunction: An array of functions or a single function which is needed to be appended
	* existingTransforms: A string 'response' or 'request' is used to choose from default transformations
	* returns: An array of transform functions
	*/
	var appendTransformation = function (transformFunction, existingTransforms) {
		var appended = [];
		if (existingTransforms == 'response') {
			appended = VariableUtils.push($http.defaults.transformResponse, transformFunction);
		} else if (existingTransforms == 'request') {
			appended = VariableUtils.push(transformFunction, $http.defaults.transformRequest);
		} else if (VariableUtils.isDefined(existingTransforms)){
			appended = VariableUtils.push(existingTransforms, transformFunction);
		} else {
			appended = VariableUtils.push(transformFunction);
		}
		return appended;
	}
	return {
		appendTransformation: appendTransformation
	}
})