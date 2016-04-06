angular.module('main')
.directive('sodEditor', function ($location) {
	return {
		restrict: 'E',
		scope: {
			sod: '=sod'
		},
		controller: 'SodEditorCtrl',
		templateUrl: 'modules/main/views/SodEditor.html',
		link: function (scope, element, attrs) {
			// This code is used to move to the editor when an editor is opened
			// Editor has an id sod-editor, and the URL hash is modified to move to that div
			location.hash ='#sod-editor';
		}
	}
});