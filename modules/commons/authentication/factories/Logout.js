angular.module('authentication')
.factory('AuthLogout', function ($cookies, $window, $location, $http, TeamConstants) {
	var logout = function () {
		url = TeamConstants.LOGOUT_URL + "?target=" + $location.absUrl();
		$http.get(url)
		.success(function (data) {
			$cookies.remove('Spiffy_Session', {path: '/'});
			$window.location.href = url;
		});
	}
	return {
		logout: logout
	}
})