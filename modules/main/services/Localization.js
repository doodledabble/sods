angular.module('main')
.service('Localization', function ($rootScope) {
	var supportedLocales = ['da', 'de', 'en', 'es', 'fr', 'it', 'ja', 'nl', 'pt', 'ru', 'sv', 'zh_CN', 'zh_TW'];
	var locale = $rootScope.locale;

	var isLocaleSupported = function (locale) {
		if (supportedLocales.toLowerCase().indexOf(locale.toLowerCase()) > -1) {
			return true;
		} else {
			return false;
		}
	};

	var getLocale = function () {
		var locale =  $rootScope.locale;
	    for(var i = 0 ; i < supportedLocales.length; i++){
	        if(supportedLocales[i] === locale[0] ){
	        return locale[0];
	        }
	    }
		return "en";
	};

	var getLocalizedValue = function (localizedValues) {
		return localizedValues[getLocale()];
	};

	return {
		getLocale : getLocale,
		getLocalizedValue : getLocalizedValue
	};
});