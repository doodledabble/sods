angular.module('main', ['ngResource', 'authentication', 'confirm', 'tree', 'feedback', 'detectKeys', 'doFocus', 'utilities', 'ngSanitize', 'ngCookies','gettext']);

angular.module('main').run();

var defaultRBPMContext = '/IDMProv'; 

initialize().then(bootstrapApplication);


function initialize() {
    var initInjector = angular.injector(["ng"]);
    var $http = initInjector.get("$http");

    return $http.get("LoadSodConfigServlet").then(function(response) {
    	angular.module('main').constant('config', {
    		context: response.data.context,
    		AuthorizeUrl: response.data.Authorize,
    		LogoutUrl: response.data.Logout,
    		clientId: response.data.RRAClientID,
    		redirectUrl: response.data.RRARedirectUrl
    });
    }, function(errorResponse) {
    	angular.module('main').constant('config', {
    		context: defaultRBPMContext
        });
    });
}

function bootstrapApplication() {
    angular.element(document).ready(function() {
        angular.bootstrap(document, ["main"]);
    });
}