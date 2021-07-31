PaisaSavvy.controller('Invest', [
    '$scope', '$location', '$http', 'Config', '$timeout',
    function($scope, $location, $http, Config, $timeout) {
        // init
        $scope.stepProgress = 25;
        $timeout(function() {
            $scope.stepProgress = 50;
        }, 1000);

        // scope
        $scope.data = {
            amount: 8000,
            income: 0,
            age: 0,
            error: "",
        };
        $scope.card = 1;
        var maxCards = 8;

        $scope.showFunds = function() {
            $scope.data.error = "";
            if (!$scope.data.amount) {
                $scope.data.error = "Please enter a valid investment amount";
            } else if ($scope.data.amount < 100) {
                $scope.data.error = "Minumum investment amount is Rs.500";
            } else {
                $location.path(Config.Path.payment);
            }
        };
        
        $scope.toFunds = function() {
            $scope.data.error = " ";
            $location.path(Config.Path.payment);
        };

        $scope.filterNumbers = function(key) {
            $scope.data.error = " ";
            $scope.data[key] = parseInt($scope.data[key]);
        };

        $scope.back = function() {
            $scope.data.error = " ";
            if ($scope.card > 1) {
                $scope.card -= 1;
                $scope.stepProgress -= 3;
            }
        };

        $scope.next = function() {
            $scope.data.error = " ";
            if ($scope.card < maxCards) {
                $scope.card += 1;
                $scope.stepProgress += 3;
            }
        };
    }
]);