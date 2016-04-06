angular.module('utilities')
.service('VariableUtils', function () {
	/**
	* This function pushes a variable or array to an array
	* pass in an array or variable or both input can be variables
	* The return value will always be an array
	*/
	var push = function (array, variable) {
		var result = [];
		if (isArray(array)) {
			for (var i = 0; i < array.length; ++i) {
				result.push(array[i]);
			}
		} else  if (isDefined(array)) {
			result.push(array);
		}
		if (isArray(variable)) {
			for (var i = 0; i < variable.length; ++i) {
				result.push(variable[i]);
			}
		} else if (isDefined(variable)){
			result.push(variable);
		}
		return result;
	}
	/*
	*
	* This variable checks if the variable is defined
	*/
	var isDefined = function (input) {
		if (typeof input == 'undefined') {
			return false;
		} else {
			return true;
		}
	}

	/*
	* This function accepts a variable and will return true if the variable is an array
	*/
	var isArray = function (input) {
		if (isDefined(input) && !isNull(input) && isDefined(input.constructor) && input.constructor == Array) {
			return true;
		} else {
			return false;
		}
	}

	/**
	Check the passed in variable is true or false
	*/
	var isTrue = function (value) {
		if (isDefined(value)) {
			if (value == true || value == 'true') {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	Check if input is null
	*/
	var isNull = function (value) {
		if (isDefined(value)) {
			if (value == null) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/*
	** Check if Item present in list 
	*/
	var isPresent = function (item, list) {
		if(item!=undefined && item!=null && isArray(list)) {
			for (var i = 0; i < list.length; ++i) {
				var x = (item.dn==undefined)?item.id:item.dn;
		  		var y = (list[i].dn==undefined)?list[i].id:list[i].dn;
				if (x == y) {
					return true;
				}
			}
		}
		return false;
	}

	return {
		isDefined: isDefined,
		isArray: isArray,
		push: push,
		isTrue: isTrue,
		isNull: isNull,
		isPresent: isPresent
	}
})