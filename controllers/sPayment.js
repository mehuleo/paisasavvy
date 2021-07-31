PaisaSavvy.controller('sPayment', [
    '$scope', '$location', '$http', 'Config', '$timeout',
    function($scope, $location, $http, Config, $timeout) {
        // init
        // scope
        $scope.data = {
            error: "",
            risk: "Low",
            amount: localStorage.getItem('invamount'),
        };
    }
]);