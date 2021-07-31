PaisaSavvy.controller('Advise', [
    '$scope', '$location', '$http', 'Config', '$timeout',
    function($scope, $location, $http, Config, $timeout) {
        // init
        $scope.data = {
            investment: 150000,
            taxB: 30,
            taxCalculated: false,
            returnRate: 16,
            netReturnValue: 0,
            taxSaving: 0 ,
        };


        $scope.data.taxSaving = parseInt($scope.data.investment * $scope.data.taxB / 100);
        $scope.data.netReturnValue = parseInt(
            $scope.data.investment * Math.pow(1 + $scope.data.returnRate/100, 3)
        );

        $scope.toInvest = function() {
            $location.path(Config.Path.invest);
        };

    }
]);