/**
 This filter accepts a list of members and comma separated list of types
 and returns a subset of the list whose elements matches one of the types
**/

angular.module('main')
.filter('MemberType', function (VariableUtils) {
	var isPresent = function (item, type) {
		var types = type.split(',');
		for (var i = 0; i < list.length; ++i) {
			if (item.type == types[i]) {
				return true;
			}
		}
		return false;
	}

	return function (inputList, type) {
		if (VariableUtils.isArray(inputList)) {
			var filteredList = [];
			for (var i = 0; i < inputList.length; ++i) {
				if (isPresent(inputList[i])) {
					filteredList.push(inputList[i]);
				}
			}
			return filteredList;
		} else {
			return inputList;
		}
	}
})