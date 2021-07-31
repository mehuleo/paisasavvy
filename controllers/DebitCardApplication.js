PaisaSavvy.controller('DebitCardApplication', [
    '$rootScope', '$scope', '$location', '$http', 'Config', '$timeout',
    function($rootScope, $scope, $location, $http, Config, $timeout) {
        // GA
        $timeout(function() {
            window.ga('send', 'pageview', $location.path().replace("/", ""));
        }, 3400);

        // scope
        $scope.loading = false;
        $scope.debitCardData = {};
        $scope.formData = {
            mothersName: "",
            nameOnCard: "",
            Error: {}
        };

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

        $scope.validate = function() {
            $scope.formData.Error.mothersName = '';
            $scope.formData.Error.nameOnCard = '';
            $scope.formData.Error.agree = '';
            $scope.formData.Error.common = '';

            if (!$scope.formData.nameOnCard) {
                $scope.formData.Error.nameOnCard = "Please provide name on debit card.";
                $scope.formData.Error.common = "Please provide name on debit card.";
            } else if (!$scope.formData.mothersName) {
                $scope.formData.Error.mothersName = "Please provide Mother's Name.";
                $scope.formData.Error.common = "Please provide Mother's Name.";
            } else if (!$scope.formData.agree) {
                $scope.formData.Error.agree = "Please provide confirm the delivery address.";
            } else {
                $scope.getDebitCard();
            }
        };

        $scope.getDebitCard = function(selfReq) {
            $scope.loading = true;
            // 
            $http({
                method: 'POST',
                url: Config.API.applyForDebitCard,
                data: {
                    mothersName: $scope.formData.mothersName,
                    nameOnCard: $scope.formData.nameOnCard,
                }
            }).then(function successCallback(response) {
                $scope.loading = false;
                // console.log("successCallback", response);
                if (response.data.status == 403) {
                    $location.path("/");
                } else if (response.data.success) {
                    swal("Applied!", response.data.message, "success")
                        .then(function() {
                            $location.path(Config.Path.MyAccount);
                            $scope.safeApply();
                        });

                } else if (!!selfReq && response.data.success == false && response.data.DebitCard) {
                    $scope.debitCardData = response.data.DebitCard;
                    $scope.formData.nameOnCard = $scope.debitCardData.name;
                } else {
                    swal("Oops!", response.data.message, "error");
                }
            }, function errorCallback(error) {
                console.log("failCallback", error);
                $scope.loading = false;
            });
        };
        $scope.getDebitCard(1);

        // 
        $scope.safeApply = function(fn) {
            var phase = this.$root.$$phase;
            if (phase == '$apply' || phase == '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

    }
]);