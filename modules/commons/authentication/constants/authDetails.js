/**
 *The urls required for the authentication 
 */
angular.module('authentication')
.constant('GRANT_URL', '/osp/a/idm/auth/oauth2/grant')
.constant('REDIRECT_URI', '/rra/com.netiq.rra.index/oauth.html')
.constant('CLIENT_ID', 'rra')
.constant('RESPONSE_TYPE', 'token')
.constant('LOGOUT_URL', '/osp/a/idm/auth/app/logout')
