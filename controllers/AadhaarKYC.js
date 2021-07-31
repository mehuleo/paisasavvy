PaisaSavvy.controller('AadhaarKYC', [
    '$scope', '$location', '$http', 'Config', '$timeout',
    function($scope, $location, $http, Config, $timeout) {
        // GA
        $timeout(function(){
            window.ga('send', 'pageview', $location.path().replace("/",""));
        }, 3400);
        // init
        $scope.stepProgress = 5;
        $timeout(function(){
            $scope.stepProgress = 25;
        }, 1000);

        // 
        $scope.Path = Config.Path;
        if($location.path().indexOf('/mobile/') != -1) {
            $scope.Path = Config.MobilePath;
        }
        
        // scope
        $scope.loading = false;
        $scope.loading = false;
        $scope.mobileData = {
            showMenu: false,
        };
        $scope.formData = {
            name: "",
            mobile: localStorage.getItem("mobile") || "",
            pan: localStorage.getItem("PAN") || "",
            aadhaar: "",
            email: "",
            Error: {},
        };
    
        $scope.filterNumbers = function() {
            $scope.formData.error = " ";
            $scope.formData.aadhaar = parseInt($scope.formData.aadhaar);
        };

        $scope.validate = function() {
            $scope.formData.Error.name = '';
            $scope.formData.Error.pan = '';
            $scope.formData.Error.aadhaar = '';
            $scope.formData.Error.email = '';
            $scope.formData.Error.common = "";

            var PANMatch = $scope.formData.pan.trim().match(/^[A-Z][A-Z][A-Z]P[A-Z]\d\d\d\d[A-Z]$/ig) || [];
            var AadhaarMatch = $scope.formData.aadhaar.trim().match(/^\d\d\d\d\d\d\d\d\d\d\d\d$/ig) || [];
            var emailMatch = $scope.formData.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ig) || [];
            // 
            if (!$scope.formData.name) {
                $scope.formData.Error.name = "Please provide investor name.";
                $scope.formData.Error.common = "Please provide investor name.";
                document.getElementById("name").focus();
            } else if (!$scope.formData.aadhaar || $scope.formData.aadhaar != AadhaarMatch[0]) {
                $scope.formData.Error.aadhaar = "Please provide a valide 12 digit Aadhaar Number.";
                $scope.formData.Error.common = "Please provide a valide 12 digit Aadhaar Number.";
                document.getElementById("aadhaar").focus();
            } else if (!$scope.formData.pan || $scope.formData.pan != PANMatch[0]) {
                $scope.formData.Error.pan = "Please provide a valid PAN.";
                $scope.formData.Error.common = "Please provide a valid PAN.";
                document.getElementById("pan").focus();
            } else if (!$scope.formData.email || $scope.formData.email != emailMatch[0]) {
                $scope.formData.Error.email = "Please provide your email-id.";
                $scope.formData.Error.common = "Please provide your email-id for KYC related communication.";
                document.getElementById("email").focus();
            } else {
                $scope.doKYC();
            }
        };

        $scope.doKYC = function() {
            $scope.formData.Error.common = "";
            $scope.loading = true;
            // 
            $http({
                method: 'POST',
                url: Config.API.getEKYCLink,
                data: {
                    name: $scope.formData.name,
                    mobile: $scope.formData.mobile,
                    pan: $scope.formData.pan,
                    aadhaar: $scope.formData.aadhaar,
                    email: $scope.formData.email,
                    isMobile: $location.path().indexOf("/mobile/") !== 1 ? true : false,
                }
            }).then(function successCallback(response) {
                $scope.loading = false;
                console.log("successCallback", response);
                if (response.data.success && response.data.redirect) {
                    window.location.href = response.data.redirect;
                } else if (response.data.status == 403) {
                    $location.path("/");
                } else {
                    $scope.formData.Error.common = "Something went wrong. Please try after sometime.";
                }
            }, function errorCallback(error) {
                $scope.loading = false;
                console.log("failCallback", error);
                $scope.formData.Error.common = "Something went wrong. Please try after sometime.";
            });
        };


        // -----------------------------------------------------
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