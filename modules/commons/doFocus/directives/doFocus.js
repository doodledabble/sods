angular.module("doFocus")
.directive('doFocus', function () {
  return {
  	link: function (scope, element, attrs) {
           if(attrs.doFocus=="true") {
           		element.focus();
           }
  	}
  }
});