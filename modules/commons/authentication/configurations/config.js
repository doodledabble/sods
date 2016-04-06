angular.module('authentication')
.config(function ($httpProvider) {
	
	$httpProvider.interceptors.push('AuthInterceptor');
	
})