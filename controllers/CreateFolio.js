PaisaSavvy.controller('CreateFolio', [
    '$rootScope', '$scope', '$location', '$http', 'Config', '$timeout', '$sce', '$window',
    function($rootScope, $scope, $location, $http, Config, $timeout, $sce, $window) {
        // GA
        $timeout(function(){
            window.ga('send', 'pageview', $location.path().replace("/",""));
        }, 3400);
        // init
        $scope.stepProgress = 5;
        $timeout(function(){
            $scope.stepProgress = 90;
        }, 1000);

        // scope
        $scope.loading = false;
        if(!$rootScope.folioURL) {
            $location.path(Config.Path.ClientDetails);
            return;
        }

        $scope.receiveMessage = function(event) {
            if(!event.data || event.data.from != "doredirect.html") {
                console.log("Message from someone:", event.data);
                return false;
            }
            var URL = decodeURI(event.data.url);
            URL = URL.substr(URL.indexOf("redirect.html?") + 14);
            URL = URL.split('&');
            if(!URL.length) {
                return;
            }
            var params = {};
            for(var i in URL) {
                var d = URL[i].split("=");
                params[d[0]] = d[1];
            }
            console.log("==>", params);
            if($scope.loading) return;
            $scope.loading = true;
            $http({
                method: 'POST',
                url: Config.API.updateUserFolio,
                data: params,
            }).then(function successCallback(response) {
                $scope.loading = false;
                console.log("successCallback", response);
                if(response.data.success)
                    $location.path(Config.Path.MyAccount);
                else
                    $location.path(Config.Path.ClientDetails);
            }, function errorCallback(error) {
                $scope.loading = false;
                console.log("failCallback", error);
                $location.path(Config.Path.ClientDetails);
            });
        };
        window.addEventListener("message", $scope.receiveMessage, false);
        $scope.createFolioURL = $sce.trustAsResourceUrl($rootScope.folioURL);

    }
]);