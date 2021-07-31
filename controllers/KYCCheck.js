PaisaSavvy.controller('KYCCheck', [
    '$scope', '$location', '$http', 'Config', '$timeout',
    function($scope, $location, $http, Config, $timeout) {
        // GA
        $timeout(function(){
            window.ga('send', 'pageview', $location.path().replace("/",""));
        }, 3400);
        // init
        // scope
        $scope.loading = false;
        $scope.mobileData = {
            showMenu: false,
            signupLabel: "Sign Up",
        };
        $scope.data = {
            pan: "",
            error: "",
        };
        // 
        $scope.stepProgress = 0;
        $timeout(function() {
            $scope.stepProgress = 5;
        }, 1000);

        // 
        $scope.Path = Config.Path;
        if($location.path().indexOf('/mobile/') != -1) {
            $scope.Path = Config.MobilePath;
        }

        $scope.textTransform = function() {
            $scope.data.pan = $scope.data.pan.toUpperCase();
        };

        $scope.getKYC = function() {
            $scope.data.error = "";
            var match = $scope.data.pan.trim().match(/^[A-Z][A-Z][A-Z]P[A-Z]\d\d\d\d[A-Z]$/ig) || [];
            if (!$scope.data.pan || $scope.data.pan != match) {
                $scope.data.error = "Please enter a valid PAN";
                return;
            }
            // 
            $scope.loading = true;
            $http({
                method: 'POST',
                url: Config.API.KYCCheck,
                data: {
                    pan: $scope.data.pan
                }
            }).then(function successCallback(response) {
                console.log("successCallback", response);
                localStorage.setItem("PAN", $scope.data.pan);
                if (response.data.user && response.data.user.isPANKYC) {
                    if (response.data.user.hasFolio > 0) {
                        $location.path($scope.Path.MyAccount);
                    } else {
                        $location.path($scope.Path.ClientDetails);
                    }
                }  else if (response.data.status == 403) {
                    $location.path("/");
                } else {
                    $location.path($scope.Path.AadhaarKYC);
                }
                $scope.loading = false;
            }, function errorCallback(error) {
                $scope.loading = false;
                // console.log("failCallback", error);
                // $location.path($scope.Path.kyc);
            });

        };

        // 
        $scope.doLogout = function() {
            $http({
                method: 'GET',
                url: Config.API.doLogout,
            }).then(function successCallback(response) {
                $scope.loading = false;
                $location.path("/");
            }, function errorCallback(error) {
                // console.log("failCallback", error);
                $scope.loading = false;
                $location.path("/");
            });
        };
        
        // ----------------------------
        $scope.gotoPath = function(path) {
            $location.path(path);
        };
        // Mobile
        $scope.openWhatsapp = function(device) {
            if (device == "api")
                window.open("https://api.whatsapp.com/send?phone=919845900942");
            else
                window.open("https://web.whatsapp.com/send?phone=919845900942");
        };
        $scope.mOpenMenu = function() {
            $scope.mobileData.showMenu = true;
        };
        $scope.mCloseMenu = function() {
            $scope.mobileData.showMenu = false;
        };

    }
]);