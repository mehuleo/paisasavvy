PaisaSavvy.controller('Payment', [
    '$scope', '$location', '$http', 'Config', '$timeout',
    function($scope, $location, $http, Config, $timeout) {
        // init
        $scope.stepProgress = 65;
        $timeout(function() {
            $scope.stepProgress = 80;
        }, 1000);

        $scope.paymentFailed = false;
        if($location.path().indexOf("fail") >= 0) {
            $timeout(function() {
                alert("Your payment has failed, please try again, after sometime.");
            }, 1000);            
        }
        // scope
        $scope.data = {
            error: "",
            risk: "Low",
            amount: 150000,
        };

        $scope.toInvest = function() {
            $location.path(Config.Path.invest);
        };

        $scope.doPay = function() {
            $http({
                method: 'POST',
                url: Config.API.doPay,
                data: {
                    "amount": $scope.data.amount,
                    "client": {
                        "phone": "8792476875"
                    }
                }
            }).then(function successCallback(response) {
                console.log("successCallback", response);
                localStorage.setItem('invamount', $scope.data.amount);
                if (response.data && response.data.rURL) {
                    location.href = response.data.rURL;
                }
            }, function errorCallback(error) {
                console.log("failCallback", error);
            });
        };
    }
]);