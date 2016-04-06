//Appends the requred headers to every request

angular.module('main')
.service('HeaderInterceptor', function (SodConstants, $cookies) {
	var headerGenerator = function (config) {
		config.headers[SodConstants.CACHE_CONTROL] = SodConstants.NO_CACHE_NO_STORE_MUST_REVALIDATE;
		config.headers[SodConstants.PRAGMA] = SodConstants.NO_CACHE;
		config.headers[SodConstants.EXPIRES] = SodConstants.ZERO;
		config.headers[SodConstants.REFRESH] = SodConstants.DAY_SECONDS;
		var headerValue = $cookies.get(SodConstants.HEADER_NAME);
		if (angular.isDefined(headerValue)) {
			config.headers[SodConstants.HEADER_NAME] = headerValue;
		}

		return config;
	}

	return {
		request: headerGenerator
	}
})