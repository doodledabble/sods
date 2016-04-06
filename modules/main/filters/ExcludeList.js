angular.module('main')
.filter('ExcludeList', function (VariableUtils) {
	// var isPresent = function (item, list) {
	// 	for (var i = 0; i < list.length; ++i) {
	// 		var x = (item.dn==undefined)?item.id:item.dn;
	//   		var y = (list[i].dn==undefined)?list[i].id:list[i].dn;
	// 		if (x == y) {
	// 			return true;
	// 		}
	// 	}
	// 	return false;
	// }

	return function (inputList, excludeList) {
		// console.log("Input List : "+JSON.stringify(inputList));
		// console.log("ExcludeList : "+JSON.stringify(excludeList));
		if (!(VariableUtils.isArray(inputList) && VariableUtils.isArray(excludeList))) {
			if (VariableUtils.isDefined(excludeList)) {
				excludeList = [excludeList];
			} else {
				return inputList;
			}
		}
		var filteredList = [];
		if(inputList) {
			for (var i = 0; i < inputList.length; ++i) {
				if (!VariableUtils.isPresent(inputList[i], excludeList)) {
					filteredList.push(inputList[i]);
				}
			}
		}
		
		// console.log("filteredList : "+JSON.stringify(filteredList));
		return filteredList;
	}
})