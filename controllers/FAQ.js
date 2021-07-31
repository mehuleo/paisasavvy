PaisaSavvy.controller('FAQ', [
    '$scope', '$location', '$http', 'Config', '$timeout',
    function($scope, $location, $http, Config, $timeout) {
        // GA
        $timeout(function() {
            window.ga('send', 'pageview', $location.path().replace("/", ""));
        }, 3400);
        // scope
        // ---------------------------------------------------------------------
        // Hack
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