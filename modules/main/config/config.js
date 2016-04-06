angular.module('main')
.config(function ($httpProvider) {
	$httpProvider.interceptors.push('HeaderInterceptor');
})