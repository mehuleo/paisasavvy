PaisaSavvy.controller('Landing2', [
    '$scope', '$location', '$http', 'Config', '$timeout',
    function($scope, $location, $http, Config, $timeout) {
        // GA
        $timeout(function() {
            window.ga('send', 'pageview', "Landing2");
        }, 3400);

        $timeout(function() {
            // window.ga.trackView('WebHome');
        }, 550);
        // 
        $scope.Path = Config.Path;
        if ($location.path().indexOf('/mobile/') != -1) {
            $scope.Path = Config.MobilePath;
        }

        // if mobile
        if (/Android|Opera Mini|iPhone/i.test(navigator.userAgent)) {
            if($location.path() == Config.Path.home)
                $location.path(Config.MobilePath.home);
            else if($location.path() == Config.Path.login)
                $location.path(Config.MobilePath.login);
        } else  {
            if($location.path() == Config.MobilePath.home)
                $location.path(Config.Path.home);
            else if($location.path() == Config.MobilePath.login)
                $location.path(Config.Path.login);
        }
        // init
        $scope.loading = false;
        $scope.showVideo = false;
        $scope.mobileData = {
            showMenu: false,
            signupLabel: "Sign Up",
        };
        $scope.formData = {
            showLogin: false,
            showMobile: true,
            showOTP: false,
            mobile: "",
            otp: "",
            error: "",
        };


        // 
        $scope.filterNumbers = function(key) {
            if (!key) return;
            $scope.formData.error = "";
            $scope.formData[key] = parseInt($scope.formData[key]);
        };

        $scope.sendOTP = function() {
            $scope.formData.error = "";
            var match = ($scope.formData.mobile + "" || "").match(/^\d\d\d\d\d\d\d\d\d\d$/ig) || [];
            if ($scope.formData.mobile != match[0]) {
                $scope.formData.error = "Require a valid 10 digit mobile number."
                return;
            }
            // 
            $scope.loading = true;
            $http({
                method: 'GET',
                url: Config.API.getOTP + '?mobile=' + $scope.formData.mobile + "&email="
            }).then(function successCallback(response) {
                $scope.loading = false;
                console.log("successCallback", response);
                if (response.data && response.data.success) {
                    $scope.formData.showMobile = false;
                    $scope.formData.showOTP = true;
                }
            }, function errorCallback(error) {
                $scope.loading = false;
                console.log("failCallback", error);
                $scope.formData.error = "Something went wrong. Please try after sometime."
            });
        };

        // 
        $scope.validateOTP = function() {
            $scope.formData.error = "";
            var match = ($scope.formData.otp + "").match(/^\d\d\d\d\d\d$/ig) || [];
            if ($scope.formData.otp != match[0]) {
                $scope.formData.error = "Require a valid 6 digit OTP."
                return;
            }
            // 
            $scope.loading = true;
            $http({
                method: 'POST',
                url: Config.API.verifyOTP,
                data: {
                    mobile: $scope.formData.mobile,
                    otp: $scope.formData.otp,
                }
            }).then(function successCallback(response) {
                $scope.loading = false;
                console.log("successCallback", response);
                if (response.data && response.data.success) {
                    localStorage.setItem("mobile", $scope.formData.mobile);
                    if (response.data.user && response.data.user.isPANKYC) {
                        if (response.data.user.hasFolio > 0) {
                            $location.path($scope.Path.MyAccount);
                        } else {
                            $location.path($scope.Path.ClientDetails);
                        }
                    } else {
                        $location.path($scope.Path.KYCCheck);
                    }
                } else if (response.data && !response.data.success) {
                    $scope.formData.error = response.data.message || "Please enter a valid OTP";
                }
            }, function errorCallback(error) {
                $scope.loading = false;
                console.log("failCallback", error);
                $scope.formData.error = "Please enter a valid OTP";
            });
        };

        // ---------------------------------------------------------------------
        $scope.gotoPath = function(path) {
            $location.path(path);
        };
        $scope.closePopup = function() {
            $scope.formData.showLogin = false;
            $scope.formData.showMobile = false;
            $scope.formData.showOTP = false;
        };
        $scope.doSignUp = function() {
            $scope.formData.showLogin = true;
            $scope.formData.showMobile = true;
            $scope.formData.showOTP = false;
            $scope.mobileData.showMenu = false;
            $scope.mobileData.signupLabel = "Sign Up";
            window.ga('send', 'event', "landing3", "click", "SingUp");
        };
        $scope.doSignIn = function() {
            $scope.formData.showLogin = true;
            $scope.formData.showMobile = true;
            $scope.formData.showOTP = false;
            $scope.mobileData.showMenu = false;
            $scope.mobileData.signupLabel = "Sign In";
            window.ga('send', 'event', "landing3", "click", "SingIn");
        };
        // 
        $scope.openAppStore = function() {
            window.open("https://play.google.com/store/apps/details?id=com.paisasavvy.app");
        };
        $scope.openWhatsapp = function(device) {
            if (device == "api")
                window.open("https://api.whatsapp.com/send?phone=919845900942");
            else
                window.open("https://web.whatsapp.com/send?phone=919845900942");
            window.ga('send', 'event', "landing3", "click", "Whatsapp");
        };

        // Mobile
        $scope.mOpenMenu = function() {
            $scope.mobileData.showMenu = true;
            $scope.safeApply();
            window.ga('send', 'event', "landing3", "click", "mOpenMenu");
        };
        $scope.mCloseMenu = function() {
            $scope.mobileData.showMenu = false;
            $scope.safeApply();
        };
        // Video
        $scope.showvid = function(isMobile) {
            var ifrm = document.getElementById('paisasavvyVideo');
            if (ifrm) {
                if (isMobile)
                    ifrm.src = "https://www.youtube.com/embed/BRXiddicVXo?rel=0";
                else
                    ifrm.src = "https://www.youtube.com/embed/BRXiddicVXo?controls=0&autoplay=1&rel=0";
            } else {
                swal("Sorry, something went wrong, please refresh the page.");
            }
            $scope.showVideo = true;
            window.ga('send', 'event', "landing3", "click", "PlayVid");
        };
        $scope.hidevid = function() {
            var ifrm = document.getElementById('paisasavvyVideo');
            if (ifrm) {
                ifrm.src = "";
            }
            $scope.showVideo = false;
            window.ga('send', 'event', "landing3", "click", "CloseVid");
        };

        // ---------------------------------------------------------------------
        $scope.currentSlide = 0;
        $scope.onSlideChange = function() {
            console.log($scope.siema.currentSlide);
            $scope.currentSlide = $scope.siema.currentSlide;
            $scope.safeApply();
        };
        $scope.doSlideChange = function(i) {
            $scope.siema.goTo(i, $scope.onSlideChange);
        };
        $scope.doNextSlide = function(i) {
            $scope.siema.next(1, $scope.onSlideChange);
            window.ga('send', 'event', "landing3", "click", "doNextSlide");
        };
        $scope.doPrevSlide = function(i) {
            $scope.siema.prev(1, $scope.onSlideChange);
            window.ga('send', 'event', "landing3", "click", "doPrevSlide");
        };
        try {
            $scope.siema = new Siema({
                selector: '.siema',
                duration: 200,
                easing: 'ease-out',
                perPage: 1,
                startIndex: 0,
                draggable: true,
                multipleDrag: false,
                threshold: 20,
                loop: true,
                onInit: function() {},
                onChange: $scope.onSlideChange,
            });
        } catch (e) {
            console.log("Error", e);
        }
        // ---------------------------------------------------------------------
        localStorage.clear();
        // ---------------------------------------------------------------------
        // SIP Calculator
        $scope.SIPCalculatorData = {
            showCalc: true,
            title: $location.search().title,
            desc: $location.search().desc,
            age: 22,
            amount: 7000,
            appraisal: 10,
            return: 17.5,
            millionByAge: 28,
            millionByYear: 6,
            crorepatiByAge: 37,
            crorepatiByYear: 15,
            risk: 5,
            riskLevel: [
                "Cautious",
                "Tentative",
                "Confident",
                "Ambitious",
                "Adventurous",
            ],
            calcTable: [],
        };
        $scope.hideSIPCalculator = function() {
            $scope.SIPCalculatorData.showCalc = false;
        };
        $scope.SIPCalculatorSetReturn = function() {
            var returns = [6.5, 10, 12, 15, 17.5];
            $scope.SIPCalculatorData.return = returns[$scope.SIPCalculatorData.risk - 1];
        };
        $scope.reSIPCalculatorData = function() {
            $scope.SIPCalculatorData.showCalc = true;
            var monthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sup", "Oct", "Nov", "Dec"];
            var savings = 0,
                sip = $scope.SIPCalculatorData.amount,
                mil = 0,
                crore = 0,
                now = new Date(),
                year = now.getFullYear();
            now.setDate(1);
            // reset
            $scope.SIPCalculatorData.calcTable = [{
                gist: {},
                cal: []
            }];
            // 
            while (true) {
                now.setMonth(now.getMonth() + 1);
                if (year != now.getFullYear()) {
                    sip += sip * $scope.SIPCalculatorData.appraisal / 100;
                    year = now.getFullYear();
                    $scope.SIPCalculatorData.calcTable.push({
                        gist: {},
                        cal: []
                    });
                }
                var ret = sip * ($scope.SIPCalculatorData.return / 12) / 100;
                var sret = savings * ($scope.SIPCalculatorData.return / 12) / 100;
                savings = savings + sip + ret + sret;
                // 
                var gist = {
                    month: monthName[now.getMonth()],
                    year: now.getFullYear(),
                    sip: sip,
                    total: savings,
                    return: ret,
                };
                $scope.SIPCalculatorData.calcTable[$scope.SIPCalculatorData.calcTable.length - 1].gist = gist;
                $scope.SIPCalculatorData.calcTable[$scope.SIPCalculatorData.calcTable.length - 1].cal.push(gist);
                // 
                if (mil == 0 && savings > 1000000) {
                    mil = new Date(now);
                } else if (crore == 0 && savings > 10000000) {
                    crore = new Date(now);
                    break;
                }
            }
            // 
            now = new Date();
            // $scope.SIPCalculatorData.millionByYear = mil.getFullYear();
            $scope.SIPCalculatorData.millionByAge = $scope.SIPCalculatorData.age + (mil.getFullYear() - now.getFullYear());
            $scope.SIPCalculatorData.millionByYear = mil.getFullYear() - now.getFullYear();
            // $scope.SIPCalculatorData.crorepatiByYear = crore.getFullYear();
            $scope.SIPCalculatorData.crorepatiByAge = $scope.SIPCalculatorData.age + (crore.getFullYear() - now.getFullYear());
            $scope.SIPCalculatorData.crorepatiByYear = crore.getFullYear() - now.getFullYear();
        };
        // ---------------------------------------------------------------------
        // ScrollTo Lib
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            }
            return y - 89;
        }

        $scope.scrollTo = function(eId) {
            var startY = self.pageYOffset;
            var stopY = elmYPosition(eId);
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 50) {
                scrollTo(0, stopY);
                return;
            }
            var speed = Math.round(distance / 100);
            if (speed >= 20) speed = 20;
            var step = Math.round(distance / 70);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for (var i = startY; i < stopY; i += step) {
                    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                    leapY += step;
                    if (leapY > stopY) leapY = stopY;
                    timer++;
                }
                return;
            }
            for (var i = startY; i > stopY; i -= step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY -= step;
                if (leapY < stopY) leapY = stopY;
                timer++;
            }
        }
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