PaisaSavvy.controller('MyAccount', [
    '$rootScope', '$scope', '$location', '$http', 'Config', '$timeout', '$sce',
    function($rootScope, $scope, $location, $http, Config, $timeout, $sce) {
        // GA
        $timeout(function() {
            window.ga('send', 'pageview', $location.path().replace("/", ""));
        }, 3400);

        // 
        $scope.Path = Config.Path;
        if ($location.path().indexOf('/mobile/') != -1) {
            $scope.Path = Config.MobilePath;
        }

        // scope
        $scope.loading = false;
        $scope.mobileData = {
            showMenu: false,
            signupLabel: "Sign Up",
        };
        $scope.paymentLink = "";
        $scope.showPaymentBox = false;
        $scope.showPaymentOption = false;
        $scope.showWithdrawBox = false;
        $scope.formData = {
            amount: 500,
            withdrawAmount: 100,
            error: "",
        }

        $scope.transactionList = [];
        $scope.NAVs = [];
        $scope.passbook = [];
        $scope.user = {};
        $scope.balance = {
            invstedAmount: 0,
            currentAmount: 0,
            gainRupee: 0,
            gainPercentage: 0,
            unsettledAmount: 0,
            instantWithdraw: 0,
        };
        // ----------------------------
        $scope.gotoPath = function(path) {
            $location.path(path);
        };
        // Mobile
        $scope.openWhatsapp = function(device) {
            if (device == "api")
                window.open("https://api.whatsapp.com/send?phone=919845900942");
            else
                window.open("https://web.whatsapp.com/send?phone=919845900942");
        };
        $scope.mOpenMenu = function() {
            $scope.mobileData.showMenu = true;
        };
        $scope.mCloseMenu = function() {
            $scope.mobileData.showMenu = false;
        };
        // ----------------------------
        $scope.adjustRisk = function() {
            swal("Not Applicable", "You'll be able to adjust your risk status once there's enough money in your account. Currently, your account is not eligible for Auto Investment.");
        };

        $scope.filterNumbers = function(key) {
            $scope.formData.error = "";
            $scope.formData[key] = parseInt($scope.formData[key]);
        };

        $scope.closeAllPopup = function() {
            $scope.showPaymentBox = false;
            $scope.showPaymentOption = false;
            $scope.showWithdrawBox = false;
        };

        $scope.showAddMoney = function() {
            $scope.showPaymentBox = false;
            $scope.showPaymentOption = true;
        };

        $scope.showWithdrawMoney = function() {
            $scope.showWithdrawBox = true;
            $scope.mCloseMenu();
        };

        $scope.getDebitCard = function() {
            var balance = $scope.balance.currentAmount + $scope.balance.unsettledAmount;
            if (!$scope.user.hasDebitCardData && balance > 0) {
                swal("Please wait", "You can only apply for Debit card once your transaction is approved. Currently your transaction is pending. Please try after 2 days.", "error");
            } else if (!$scope.user.hasDebitCardData && balance == 0) {
                swal("Low Balance", "You can only apply for debit card if your account balance is higher than Rs." + $scope.user.minAmountRequired + ".", "error");
            } else if (!$scope.user.DCEligible && $scope.user.hasDebitCardData) {
                swal("Not Eligible", "Your folio is not eligible for Debit Card. Please contact us for more details.", "error");
            } else if ($scope.user.minAmountRequired > $scope.balance.invstedAmount) {
                if ($scope.user.minAmountRequired <= balance) {
                    swal("You can only apply for Debit card once your transaction is approved. Currently your transaction is pending. Please try after 2 days.", "error");
                } else {
                    swal("Low Balance", "You can only apply for debit card if your account balance is higher than Rs." + $scope.user.minAmountRequired + ".", "error");
                }
            } else {
                $location.path($scope.Path.debitCardApplication);
            }
            $scope.mCloseMenu();
        };
        $scope.getDebitStatus = function() {
            swal("You've successfully applied for debit card", "Status: " + $scope.user.CardAplicationRemark);
            $scope.mCloseMenu();
        };

        $scope.doWithdraw = function() {
            $scope.formData.error = "";
            if ($scope.formData.withdrawAmount > $scope.balance.currentAmount) {
                swal("Oops!", "Your account doesn't have that much balance!", "error", {
                    button: "Dismiss!",
                });
                return false;
            } else if ($scope.formData.withdrawAmount < 100) {
                swal("Sorry!", "A minimum withdrawal amount is Rs.100", "error", {
                    button: "Dismiss!",
                });
                return false;
            }

            $scope.loading = true;
            $http({
                method: 'POST',
                url: Config.API.doWithdraw,
                data: {
                    amount: $scope.formData.withdrawAmount,
                }
            }).then(function successCallback(response) {
                $scope.loading = false;
                if (response.data.success) {
                    $scope.showWithdrawBox = false;
                    var msg = "Your withdrawal of Rs. " + response.data.amount + " is successful";
                    swal("Success!", msg, "success", {
                        button: "Dismiss!",
                    });
                    $scope.updatePassbook();
                } else {
                    var msg = response.data.message || "Something went wrong. Please try after some time."
                    swal("Failed!", msg, "error", {
                        button: "Dismiss!",
                    });
                }
            }, function errorCallback(error) {
                // console.log("failCallback", error);
                $scope.loading = false;
                $location.path("/");
            });
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

        $scope.getPaymentLink = function() {
            // if (!$scope.formData.amount || $scope.formData.amount < 500) {
            //     $scope.formData.error = "Minimum transaction amount should be greater than Rs. 500.";
            //     return;
            // }
            $scope.loading = true;
            $http({
                method: 'POST',
                url: Config.API.getPaymentLink,
                data: {
                    amount: $scope.formData.amount,
                    isMobile: $location.path().indexOf("/mobile/") !== 1 ? true : false,
                },
            }).then(function successCallback(response) {
                $scope.loading = false;
                console.log("successCallback", response);
                if (response.data.success && response.data.paymentLink) {
                    window.location.href = response.data.paymentLink;
                    // $scope.paymentLink = $sce.trustAsResourceUrl(response.data.paymentLink);
                    $scope.showPaymentBox = false;
                    $scope.showPaymentOption = false;
                } else if (response.data.status == 403) {
                    $location.path("/");
                } else {
                    var msg = response.data.message || "Something went wrong. Please try after some time."
                    swal("Failed!", msg, "error", {
                        button: "Dismiss!",
                    });
                }
            }, function errorCallback(error) {
                console.log("failCallback", error);
                $scope.loading = false;
            });
        };

        $scope.updatePassbook = function() {
            $http({
                method: 'GET',
                url: Config.API.updatePassbook,
            }).then(function successCallback(response) {
                console.log("successCallback", response);
                if (response.data.success)
                    $scope.loadMyAccount();
            });
        };

        $scope.loadMyAccount = function() {
            $scope.loading = true;
            $http({
                method: 'GET',
                url: Config.API.getAccountBalance,
            }).then(function successCallback(response) {
                $scope.loading = false;
                console.log("successCallback", response);
                if (response.data.success) {
                    $scope.user = response.data.user || {};
                    $scope.passbook = response.data.passbook || [];
                    $scope.NAVs = response.data.NAVs || [];
                    // Calculate Balance
                    $scope.balance.instantWithdraw = response.data.instantWithdraw || 0;
                    $scope.balance.invstedAmount = 0;
                    $scope.balance.currentAmount = 0;
                    $scope.balance.unsettledAmount = 0;
                    for (var i in $scope.NAVs) {
                        $scope.balance.invstedAmount += $scope.NAVs[i].netAmount;
                        $scope.balance.currentAmount += $scope.NAVs[i].curAmount;
                    }
                    for (var i in $scope.passbook) {
                        $scope.balance.unsettledAmount += $scope.passbook[i].amount;
                    }
                    $scope.balance.gainRupee = $scope.balance.currentAmount - $scope.balance.invstedAmount;
                    $scope.balance.gainPercentage = ($scope.balance.gainRupee * 100 / $scope.balance.invstedAmount) || 0;
                    // Transaction Mapping
                    $scope.transactionList = response.data.transactions || [];
                    for (var i in $scope.transactionList) {
                        $scope.transactionList[i].mf = ($scope.NAVs.filter(function(d) {
                            return d.isin == $scope.transactionList[i].isin;
                        }) || [{}])[0].scheme_name;
                    }
                    // 
                    $scope.renderChart($scope.transactionList);
                } else if (response.data.status == 403) {
                    $location.path("/");
                }
            }, function errorCallback(error) {
                $scope.loading = false;
                console.log("failCallback", error);
                $location.path("/");
            });
        };

        if ($location.search().Transaction) {
            $scope.loading = true;
            $http({
                method: 'POST',
                url: Config.API.reportTransaction,
                data: $location.search(),
            }).then(function successCallback(response) {
                $scope.loading = false;
                console.log("successCallback", response);
                if (response.data.success) {
                    $scope.updatePassbook();
                    var s = $location.search();
                    for(var i in s) {
                        $location.search(i, null);
                    }
                } else if (response.data.status == 403) {
                    $location.path("/");
                }
            }, function errorCallback(error) {
                $scope.loading = false;
                console.log("failCallback", error);
                $location.path("/");
            });
        } else {
            $scope.loadMyAccount();
        }

        $scope.renderChart = function(data) {
            return;
            // format the data
            data2 = [{
                process_date: data[0].process_date,
                netAmount: -34,
            }].concat(data);
            data2.push({
                process_date: data[data.length - 1].process_date,
                netAmount: -34,
            })
            data2.forEach(function(d) {
                d.date = new Date(d.process_date);
                d.netAmount = +d.netAmount;
            });
            // Original Data
            data.forEach(function(d) {
                d.date = new Date(d.process_date);
                d.netAmount = +d.netAmount;
            });

            // set the dimensions and margins of the graph
            var margin = { top: 13, right: 34, bottom: 21, left: 34 },
                width = 800 - margin.left - margin.right,
                height = 200 - margin.top - margin.bottom;

            // array of curve functions and tites
            var curveArray = [
                // { "d3Curve": d3.curveBasis, "curveTitle": "curveBasis" },
                { "d3Curve": d3.curveLinear, "curveTitle": "curveLinear" },
                // {"d3Curve":d3.curveCardinal,"curveTitle":"curveCardinal"},
                // {"d3Curve":d3.curveMonotoneX,"curveTitle":"curveMonotoneX"},
                // { "d3Curve": d3.curveCatmullRom, "curveTitle": "curveCatmullRom" }
            ];

            var x = d3.scaleTime().range([0, width]);
            var y = d3.scaleLinear().range([height, 0]);
            var valueline = d3.line()
                .curve(d3.curveCatmullRomOpen)
                .x(function(d) { return x(d.date); })
                .y(function(d) { return y(d.netAmount); });
            // 
            d3.select("svg").remove();
            var svg = d3.select(".line-chart").append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // SVG Gradient
            svg.append("defs")
                .append("linearGradient")
                .attr("id", "liner-grad")
                .attr("x1", "0%")
                .attr("x2", "0%")
                .attr("y1", "0%")
                .attr("y2", "100%")
                .selectAll("stop")
                .data([{
                    offset: "13%",
                    color: "rgba(3,169,244,.21)",
                }, {
                    offset: "100%",
                    color: "rgba(3,169,244,.001)",
                }])
                .enter()
                .append("stop")
                .attr("offset", function(d) { return d.offset; })
                .attr("stop-color", function(d) { return d.color; });

            // Render Path
            curveArray.forEach(function(daCurve, i) {
                // Scale the range of the data
                x.domain(d3.extent(data, function(d) { return d.date; }));
                y.domain(d3.extent(data, function(d) { return d.netAmount; }));

                // Add the paths with different curves.
                svg.append("path")
                    .datum(data)
                    .attr("class", "chart-line")
                    .attr("id", 'tag' + i)
                    .attr("d", d3.line()
                        .curve(daCurve.d3Curve)
                        .x(function(d) { return x(d.date); })
                        .y(function(d) { return y(d.netAmount); })
                    );
                svg.append("path")
                    .datum(data2)
                    .attr("class", "dummy-line")
                    .attr("d", d3.line()
                        .curve(daCurve.d3Curve)
                        .x(function(d) { return x(d.date); })
                        .y(function(d) { return y(d.netAmount); })
                    );
            });

            // Add the X Axis
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x));

            // Add the Y Axis
            svg.append("g")
                .attr("class", "y-axis")
                .call(d3.axisLeft(y));
        };

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