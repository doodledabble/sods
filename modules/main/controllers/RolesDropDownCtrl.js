angular.module('main')
.controller('RolesDropDownCtrl', function ($scope,$rootScope, Sod) {
	
    $scope.loadName = "Roles";
	$scope.role_label = "Select a Role";
	$scope.role_selection_enabled = false;
	
    // console.log("Selected Role : "+JSON.stringify($scope.selectedrole));
	// $scope.toggle_role_selection = function () {
	// 	$scope.role_selection_enabled = !$scope.role_selection_enabled;
	// }
    if($scope.selectedrole == null){
        $scope.role_label = "Select a Role";
    }
    else {
        $scope.role_label = $scope.selectedrole.name;
    }
    // console.log("Roles List in RolesDropDownCtrl: "+JSON.stringify($scope.roleslist));
    $scope.selectRole = function(role, roleID) {
        if(role) {
            $scope.role_label = role.name;
            $scope.selectedrole = role;
            if(roleID==1) {
            	$rootScope.$emit("ConflictingRole1_selected",$scope.selectedrole);
            	// console.log("Role 1 : "+JSON.stringify($scope.selectedrole));
            }
            else if(roleID==2){
            	$rootScope.$emit("ConflictingRole2_selected",$scope.selectedrole);
            	// console.log("Role 2 : "+JSON.stringify($scope.selectedrole));
            }
            $scope.role_selection_enabled = false;
        }
    }

    // $rootScope.$on("content", function($event) {
    //     console.log("clicked");
    //     if($scope.role_selection_enabled) {
    //          $scope.role_selection_enabled = false;
    //     }
    // });

    $scope.searchRolesHandler = function () {
        // console.log("Search : "+$scope.data.query);
        // if($scope.data==undefined) {
        //     $rootScope.$emit("searchRolesHandler",null);
        // }
        // else $rootScope.$emit("searchRolesHandler",$scope.data.query);
        $rootScope.$emit("searchRolesHandler",$scope.data.query);
    }

    // $scope.searchRolesHandler();

    // $scope.loadRoles 
    
    // $scope.searchRolesHandler();
    $scope.isRolesListLoading = function () {
        if($scope.loading == undefined || $scope.loading == false) return false;
        return true;
    }


    var dropDownVisible = false;
    $scope.showDropDown = function (value, event) {     
        
        // To refresh the Roles Listing everytime the dropdown is displayed.

        if($scope.data && $scope.data.query) {$scope.data.query=null;}
        $rootScope.$emit("searchRolesHandler",null);


        if (dropDownVisible == false && value == true) {
            
            // Start: Close the other role dropdown if it is open before the first one opens

            if($scope.roleid==1) {

                if($scope.role2visible) {
                    $rootScope.$emit("closeRoleDropDown",2);
                    $scope.role2visible = false;
                }
                
                $scope.role2visible = value;
            }

            else if($scope.roleid==2) {

                if($scope.role2visible) {
                    $rootScope.$emit("closeRoleDropDown",1);
                    $scope.role2visible = false;
                }
                
                $scope.role2visible = value;
            }

            // End

            dropDownVisible = value;
            
            $rootScope.emitClickEvent = function (sourceName, event) {
                $rootScope.$emit('clicked', sourceName);
                event.stopPropagation();
            }

        } else if (dropDownVisible == true){

            dropDownVisible = false;

            // Start : Update which role dropdown is closed. 

            if($scope.roleid==1) 
            
                $scope.role2visible = false;

            else if($scope.roleid==2)
                
                $scope.role2visible = false;

            // End
            
            $rootScope.emitClickEvent = function (sourceName, event) {}
        }
        event.stopPropagation();
    }

    $scope.isDropDownVisible = function () {
        return dropDownVisible;
    }

    $rootScope.$on('clicked', function (event, data) {
        $scope.showDropDown(false, event);
    });

    $rootScope.$on('closeRoleDropDown', function ($event, data){
        if($scope.roleid == data) {
            $scope.showDropDown(false, event);     
        }
    });
});