PaisaSavvy.controller('KYCCheck2', [
	'$scope', '$location', '$http', 'Config', '$timeout', 
	function($scope, $location, $http, Config, $timeout) {
        
        $timeout(function() {
            // window.ga.trackView('WebHome');
        }, 550);
        // 
        if($location.path() != Config.Path.homeMobile && /Android|Opera Mini/i.test(navigator.userAgent)) {
            // $location.path(Config.Path.homeMobile);
        } else if ($location.path() == Config.Path.homeMobile && !/Android|Opera Mini/i.test(navigator.userAgent)) {
            // $location.path(Config.Path.home);
        } 
        // init
        $scope.loading = true;
        $scope.formData = {};

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