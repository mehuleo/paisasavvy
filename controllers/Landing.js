PaisaSavvy.controller('Landing', [
	'$scope', '$location', '$http', 'Config', '$timeout', 
	function($scope, $location, $http, Config, $timeout) {
	// init
	$scope.data = {
        showLogin: false,
		showMobile: true,
		showOTP: false,
        mobile: "",
		otp: "",
        error: "",
	};
	// 
	$scope.otpRef = "";

	// Image rotate
    var dreamElm, dreams = [], t, dc = 0, loaded = [], md=4;
    function loadImg(i) {
        if(i > md || loaded[i])
            return;
        dreams[i] = new Image();
        dreams[i].onload = function(){
            loaded[i] = true;
        };
        dreams[i].src = "assets/a" + i + ".png";
    }
    function changeDream(){
        dc++;
        if(dc > md)
            dc = 1;
        if(loaded[dc]) {
            dreamElm.style.backgroundImage = "url(" + dreams[dc].src + ")";
            t = setTimeout(changeDream, 3400);
            loadImg(dc + 1);
        } else {
            loadImg(dc);
            dc--;
            t = setTimeout(changeDream, 1300);
        }
    }
    $timeout(function() {
        dreamElm = document.getElementById('dream');
        changeDream();
    }, 1300);

    
    $scope.filterNumbers = function(key) {
        $scope.data.error = " ";
        $scope.data[key] = parseInt($scope.data[key]);
    };

    $scope.getOTP = function() {
        // TODO: Validate Mobile first
        // 
        var match = ($scope.data.mobile + "" || "").match(/^\d\d\d\d\d\d\d\d\d\d$/ig) || [];
        if($scope.data.mobile != match[0]) {
            $scope.data.error = "Require a valid 10 digit mobile number."
            return;
        }
        $http({
            method: 'GET',
            url: Config.API.getOTP + '?mobile=' + $scope.data.mobile
        }).then(function successCallback(response) {
            console.log("successCallback", response);
            $scope.otpRef = response.data.otp_reference_number;
            $scope.data.showMobile = false;
            $scope.data.showOTP = true;
        }, function errorCallback(error) {
            console.log("failCallback", error);
        });
    };

    // 
    $scope.validateOTP = function() {
        $scope.data.error = "";
        var match = ($scope.data.otp + "" ).match(/^\d\d\d\d\d$/ig) || [];
        if($scope.data.otp != match[0]) {
            $scope.data.error = "Require a valid 5 digit OTP."
            return;
        }
        $http({
            method: 'POST',
            url: Config.API.verifyOtp,
            data: {
                mobile : $scope.data.mobile,
                otp : $scope.data.otp,
			    otp_reference_number : $scope.otpRef,
			}
        }).then(function successCallback(response) {
            console.log("successCallback", response);
            if(response.data.success == true && response.data.token){
                localStorage.setItem('token', response.data.token);
                $location.path(Config.Path.kyc);
            } else {
                $scope.data.error = "Please enter a valid OTP";
            }
            // TODO: check new/existing User and redirect
        }, function errorCallback(error) {
            console.log("failCallback", error);
            $scope.data.error = "Please enter a valid OTP";
        });
    };

}]);