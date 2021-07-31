PaisaSavvy.controller('Landing1', [
	'$scope', '$location', '$http', 'Config', '$timeout', 
	function($scope, $location, $http, Config, $timeout) {
        
        $timeout(function() {
            // window.ga.trackView('WebHome');
        }, 550);
        // 
        if($location.path() != Config.Path.homeMobile && /Android|Opera Mini/i.test(navigator.userAgent)) {
            $location.path(Config.Path.homeMobile);
        } else if ($location.path() == Config.Path.homeMobile && !/Android|Opera Mini/i.test(navigator.userAgent)) {
            $location.path(Config.Path.home);
        } 
        // init
        $scope.loading = true;
        $scope.formData = {
            InvestmentAmount: parseInt(localStorage.getItem('InvestmentAmount')) || 150000,
            riskLevel: 'high',
            taxSlab: 30,
            Error: {},
            calculation: {
                tax: 0,
                return: 0,
                gain: 0,
            },
        };
        $scope.showFAQ = {
            a: false,
            b: false,
            c: false,
            d: false,
        };

        // 
        $scope.reCalc = function() {
            var ret = 0;
            switch($scope.formData.riskLevel) {
                case 'low':
                    ret = .5721553998;
                    break;
                case 'moderate':
                    ret = .598630493;
                    break;
                case 'high':
                    ret = 0.6404308202;
                    break;
            }
            var tax = $scope.formData.taxSlab * (1 + 0.03) / 100;
            $scope.formData.calculation.tax = parseInt($scope.formData.InvestmentAmount * tax);
            // $scope.formData.calculation.return = parseInt($scope.formData.InvestmentAmount * Math.pow(ret, 3) - 1) - $scope.formData.InvestmentAmount;
            $scope.formData.calculation.return = parseInt($scope.formData.InvestmentAmount * ret);
            $scope.formData.calculation.gain = parseInt($scope.formData.InvestmentAmount + $scope.formData.calculation.tax + $scope.formData.calculation.return);
        };
        $scope.reCalc();
        
        // Get Portfolio Details
        $scope.data = {};
        $scope.portfolioError = "";
        $scope.loading = false;
        $scope.getPortfolio = function() {
            $scope.error = "";
            $scope.loading = true;
            $http({
                method: 'GET',
                url: Config.API.getPortfolio,
            }).then(function successCallback(response) {
                console.log("successCallback", response);
                if (response.data) {
                    $scope.data = response.data;
                    for(var i in $scope.data) {
                        var d = $scope.data[i];
                        for(var p in d.portfolio) {
                            if($location.path() != Config.Path.homeMobile) {
                                d.portfolio[p].rattings = d.portfolio[p].rattings.replace(/\*\s?/ig, '★');
                            }
                            d.portfolio[p].amcLogo = d.portfolio[p].amcLogo.replace('img', 'assets');
                        }
                    }
                } else {
                    $scope.error = "Uh Oh! Something went wrong, please try after some time."
                }
                $scope.loading = false;
            }, function errorCallback(error) {
                console.log("failCallback", error);
                $scope.error = "Uh Oh! Something went wrong, please try after some time."
                $scope.loading = false;
            });
        };
        $scope.getPortfolio();

        // 
        $scope.openAppStore = function() {
            window.open("https://play.google.com/store/apps/details?id=com.paisasavvy.app");
        };
        $scope.openWhatsapp = function(device) {
            if(device == "api")
                window.open("https://api.whatsapp.com/send?phone=919845900942");
            else
                window.open("https://web.whatsapp.com/send?phone=919845900942");
        };

}]);