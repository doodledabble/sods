angular.module('authentication')
.service('AuthInterceptor', function ($cookies, $window, $location, $document, $q, $injector, SodConstants) {
	var deferred = null;
	
	var callbackFunction = null;

	var authenticationComplete = function (response) {
		angular.element(document.querySelector('#oauthframe')).remove();
		var params = {};
		
		response = response.data;
		var queryString = response.substring(1);
        var regex = /([^&=]+)=([^&]*)/g;
        var m = regex.exec(queryString);
        while (m) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
            m = regex.exec(queryString);
        }

        $cookies.put('Spiffy_Session', params.token_type + "," + params.access_token, {path: '/'});
        var toCall = callbackFunction;
        callbackFunction = null;
        toCall();
	};
	
	var startAuthentication = function (callback) {
		callbackFunction = callback;
		$window.addEventListener('message', authenticationComplete, false);
		var url = SodConstants.GRANT_URL;
		url += "?redirect_uri=" + SodConstants.REDIRECT_URI;
		url += "&client_id=" + SodConstants.CLIENT_ID;
		url += "&response_type=" + SodConstants.RESPONSE_TYPE;
		
		var oauthframe = angular.element("<IFRAME/>");
        oauthframe.attr('id','oauthframe');
        oauthframe.attr('seamless','true');
        oauthframe.attr('class','level-max');
        oauthframe.attr('src',url);
        oauthframe.css({
            'position': 'fixed',
            'left': '0px',
            'top': '0px',
            'width': '100%',
            'height': '100%'
        });
        $document.find('body').eq(0).append(oauthframe);
	};
	
	var requestHeaderGenerator = function (config) {
		var spiffyCookie = $cookies.get('Spiffy_Session');
		if (angular.isDefined(spiffyCookie)) {
			var spiffyComponents = spiffyCookie.split(',');
			config.headers.Authorization = spiffyComponents[0] + ' ' + spiffyComponents[1];
		}
		return config;
	};
	
	var unauthorizedHandler = function (response) {
		if (response.status === 401) {
            if (deferred == null) {
                deferred = $q.defer();
                var loginFinished = function () {
                    deferred.resolve();
                    deferred = null;
                }
                startAuthentication(loginFinished);
            }
            responsePromise = deferred.promise.then(function (data) {
                var $http = $injector.get('$http');
                return $http(response.config);
            });
            return responsePromise;
        }
        return response;
	};
	
	return {
		request: requestHeaderGenerator,
		responseError: unauthorizedHandler
	}
});