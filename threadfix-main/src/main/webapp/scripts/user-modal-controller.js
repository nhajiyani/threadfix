var myAppModule = angular.module('threadfix')

// this is a shim for optional dependencies
myAppModule.value('deleteUrl', null);


myAppModule.controller('UserModalController', function ($scope, $modalInstance, $http, threadFixModalService, user, url, deleteUrl) {

    $scope.user = user;

    if (user.id) {
        $scope.pageTitle = "Editing user " + $scope.user.name;
        $scope.buttonText = "Save Changes";
    } else {
        $scope.pageTitle = "New User";
        $scope.buttonText = "Create User";
    }

    $scope.loading = false;

    $scope.ok = function (valid) {

        if (valid) {
            $scope.loading = true;

            threadFixModalService.post(url, $scope.user).
                success(function(data, status, headers, config) {
                    $scope.loading = false;

                    if (data.success) {

                        data.object.unencryptedPassword = undefined;
                        data.object.passwordConfirm = undefined;
                        $modalInstance.close(data.object);
                    } else {
                        $scope.error = "Failure. Message was : " + data.message;
                    }
                }).
                error(function(data, status, headers, config) {
                    $scope.loading = false;
                    $scope.error = "Failure. HTTP status was " + status;
                });
        }
    };

    $scope.focusInput = true;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    var makeDeleteRequest = function() {
        $http.post(deleteUrl).
            success(function(data, status, headers, config) {
                $modalInstance.close(false);
            }).
            error(function(data, status, headers, config) {
                $scope.error = "Failure. HTTP status was " + status;
            });
    }

    $scope.clickedDeleteButton = function() {
        if (!$scope.user.isDeletable) {
            alert("You cannot delete this account because doing so would leave the system without users with the ability to manage either users or roles.");
        } else if ($scope.user.isThisUser) {
            if (confirm('This is your account. Are you sure you want to remove yourself from the system?')) {
                makeDeleteRequest();
            }
        } else {
            if (confirm('Are you sure you want to delete this user?')) {
                makeDeleteRequest();
            }
        }
    }
});
