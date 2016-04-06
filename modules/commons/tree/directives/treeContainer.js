angular.module('tree')
.directive('treeContainer', function ($compile) {
	return {
		restrict: 'E',
		scope: {
			family: '=',
                        approvers: '='
		},
		templateUrl: 'modules/commons/tree/views/treeContainer.html',
		controller: 'treeCtrl'
        // compile: function(tElement, tAttr) {
        // 	var contents = tElement.contents().remove();
        //     var compiledContents;
        //     return function(scope, iElement, iAttr) {
        //     	if(!compiledContents) {
        //     		compiledContents = $compile(contents);
        //         }
        //         compiledContents(scope, function(clone, scope) {
        //         	iElement.append(clone); 
        //         });
        //     };
        // }
	}
})