angular.module('detectKeys')
.service('detectKeys', function() {

	var detectSpace = function(event) {
		if(event.keyCode===32) {
			event.stopPropagation();
			event.preventDefault();
			return true;
		}
		return false;
	}
	var detectEsc = function (event) {
		if(event.keyCode===27) {
			event.stopPropagation();
			event.preventDefault();
			return true;
		}
		return false;
	}
	var detectTab = function (event) {
		if(event.keyCode===9) {
			event.stopPropagation();
			event.preventDefault();
			return true;
		}
		return false;
	}
	return {
		detectSpace : detectSpace,
		detectEsc : detectEsc,
		detectTab: detectTab
	};
})