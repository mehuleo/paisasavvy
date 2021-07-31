PaisaSavvy.controller('KarvyKYC', [
    '$scope', '$location', '$http', 'Config', '$timeout',
    function($scope, $location, $http, Config, $timeout) {
        // init
        $scope.stepProgress = 5;
        $timeout(function(){
            $scope.stepProgress = 50;
        }, 1000);

        // scope
        $scope.data = {};
        
        function receiveMessage(event) {
            console.log("==>", event);
        };
        window.addEventListener("message", receiveMessage, false);
        
        window.iframeloaded = function() {
            console.log('--', document.getElementById('KarvyKYC').src);
            console.log('--', this.contentWindow.document.body.offsetHeight);
        };

        $scope.doKYC = function() {
            $scope.data.error = "";
            if (!$scope.data.aadhar || ($scope.data.aadhar + "").length != 12) {
                $scope.data.error = "Please enter a valid 12 digit Aadhaar Number";
                return;
            }

            $location.path(Config.Path.KarvyKYC);
            return;
            // 
            $http({
                method: 'POST',
                url: Config.API.kycCheck,
                data: {
                    sPAN: $scope.data.aadhar,
                    sDOB: "",
                    sAppName: "",
                    sExemptCategory: ""
                }
            }).then(function successCallback(response) {
                console.log("successCallback", response);
                if (response.d.Status.indexOf("Registered")) {
                    // TODO: redirect to TAX analysis
                } else {
                    $location.path(Config.Path.aadhar);
                }
            }, function errorCallback(error) {
                console.log("failCallback", error);
                $location.path(Config.Path.kyc);
            });

        };

    }
]);