/*
 * ========================================================================
 *
 * Copyright (c) 2015 Unpublished Work of Novell, Inc. All Rights Reserved.
 *
 * THIS WORK IS AN UNPUBLISHED WORK AND CONTAINS CONFIDENTIAL,
 * PROPRIETARY AND TRADE SECRET INFORMATION OF NOVELL, INC. ACCESS TO
 * THIS WORK IS RESTRICTED TO (I) NOVELL, INC. EMPLOYEES WHO HAVE A NEED
 * TO KNOW HOW TO PERFORM TASKS WITHIN THE SCOPE OF THEIR ASSIGNMENTS AND
 * (II) ENTITIES OTHER THAN NOVELL, INC. WHO HAVE ENTERED INTO
 * APPROPRIATE LICENSE AGREEMENTS. NO PART OF THIS WORK MAY BE USED,
 * PRACTICED, PERFORMED, COPIED, DISTRIBUTED, REVISED, MODIFIED,
 * TRANSLATED, ABRIDGED, CONDENSED, EXPANDED, COLLECTED, COMPILED,
 * LINKED, RECAST, TRANSFORMED OR ADAPTED WITHOUT THE PRIOR WRITTEN
 * CONSENT OF NOVELL, INC. ANY USE OR EXPLOITATION OF THIS WORK WITHOUT
 * AUTHORIZATION COULD SUBJECT THE PERPETRATOR TO CRIMINAL AND CIVIL
 * LIABILITY.
 *
 * ========================================================================
 */
angular.module('netiqHeader')
.controller('HeaderCtrl', function ($scope, AuthLogout, AboutPageFactory) {
	
	$scope.showAboutPage = false;
	//
	$scope.logout = function () {
		AuthLogout.logout();
	}
	//
	$scope.getVersionInfo = function () {
		AboutPageFactory.getVersionInfo()
		.success(function (version) {
			  $scope.showAboutPage = true;
			  $scope.versionInfo = version;
			}).
			error(function(error) {
				$scope.status = 'Unable to get the component details : ' + error.message;
			});
	}
	
});