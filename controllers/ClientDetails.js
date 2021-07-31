PaisaSavvy.controller('ClientDetails', [
    '$rootScope', '$scope', '$location', '$http', 'Config', '$timeout',
    function($rootScope, $scope, $location, $http, Config, $timeout) {
        // GA
        $timeout(function(){
            window.ga('send', 'pageview', $location.path().replace("/",""));
        }, 3400);
        // init
        $scope.mobileData = {
            showMenu: false,
        };

        $scope.stepProgress = 5;
        $timeout(function(){
            $scope.stepProgress = 70;
        }, 1000);

        // 
        $scope.Path = Config.Path;
        if($location.path().indexOf('/mobile/') != -1) {
            $scope.Path = Config.MobilePath;
        }

        // scope
        $scope.loading = false;
        $scope.formData = {
            email: "",
            dob: "",
            dobObj: "",
            birthState: "",
            taxStatus: "",
            salarySlab: "",
            occupation: "1",
            pep: "N",
            ifsc: "",
            bankAcc: "",
            accountType: "SAVING",
            bankDetails: {},
            agree: "",
            Error: {}
        };
        
        $scope.enum = {
            salarySlab: {
                "B1L": "Below 1 Lakh",
                "1-5L": "1 to 5 Lakh",
                "5-10L": "5 to 10 Lakh",
                "10-25L": "10 to 25 Lakh",
                "25L-1C": "25 to 1 Crore",
                "A1C": "Above 1 Crore",
            },
            taxStatus: {
                "01": "Individual",
                "02": "On Behalf Of Minor",
                "03": "HUF",
                "04": "Company",
                "05": "AOP/BOI",
                "06": "Partnership Firm",
                "07": "Body Corporate",
                "08": "Trust",
                "09": "Society",
                "10": "Others",
            },
            pep: {
                'Y': "Politically exposed person",
                'R': "Related to politically exposed person",
                'N': "No applicable",
            },
            occupation: {
                "5": "Agriculturist",
                "3": "Business",
                "9": "Forex Dealer",
                "7": "Housewife",
                "8": "Student",
                "6": "Retired",
                "1": "Private Sector Service",
                "2": "Government Service/ Public Sector",
            },
            accountType: {
                "SAVING": "Savings Bank Account",
                "CURRENT": "Current Account",
            },
            birthState: {
                "AN": "Andaman and Nicobar Islands",
                "AP": "Andhra Pradesh",
                "AR": "Arunachal Pradesh",
                "AS": "Assam",
                "BH": "Bihar",
                "CH": "Chandigarh",
                "CG": "Chhattisgarh",
                "DN": "Dadra and Nagar Haveli",
                "DD": "Daman and Diu",
                "GO": "Goa",
                "GU": "Gujarat",
                "HA": "Haryana",
                "HP": "Himachal Pradesh",
                "KR": "Jammu and Kashmir",
                "JD": "Jharkhand",
                "KA": "Karnataka",
                "KE": "Kerala",
                "LD": "Lakshadweep",
                "MP": "Madhya Pradesh",
                "MA": "Maharashtra",
                "MN": "Manipur",
                "ME": "Meghalaya",
                "MI": "Mizoram",
                "NA": "Nagaland",
                "ND": "New Delhi",
                "OD": "ODISHA",
                "OT": "Others",
                "PO": "Puducherry",
                "PU": "Punjab",
                "RA": "Rajasthan",
                "SI": "Sikkim",
                "TN": "Tamil Nadu",
                "TE": "Telangana",
                "TR": "Tripura",
                "UP": "Uttar Pradesh",
                "UR": "Uttarakhand",
                "WB": "West Bengal"
            },
        };

        $scope.validate = function() {
            $scope.formData.dob = "";
            if($scope.formData.dobObj)
                $scope.formData.dob = $scope.formData.dobObj.toDateString();
            // 
            $scope.formData.Error.email = '';
            $scope.formData.Error.dob = '';
            $scope.formData.Error.birthState = '';
            $scope.formData.Error.taxStatus = '';
            $scope.formData.Error.salarySlab = '';
            $scope.formData.Error.occupation = '';
            $scope.formData.Error.pep = '';
            $scope.formData.Error.bankAcc = '';
            $scope.formData.Error.ifsc = '';
            $scope.formData.Error.agree = '';

            var emailMatch = $scope.formData.email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ig) || [];
            if (!$scope.formData.email || $scope.formData.email != emailMatch[0]) {
                $scope.formData.Error.email = "Please provide a valid E-Mail ID.";
                $scope.formData.Error.common = "Please provide a valid E-Mail ID.";
            } else if (!$scope.formData.dob) {
                $scope.formData.Error.dob = "Please provide your date of birth.";
                $scope.formData.Error.common = "Please provide your date of birth.";
            } else if (!$scope.formData.birthState) {
                $scope.formData.Error.birthState = "Please provide your State of birth.";
                $scope.formData.Error.common = "Please provide your State of birth.";
            } else if (!$scope.formData.salarySlab) {
                $scope.formData.Error.salarySlab = "Please provide your salary slab.";
                $scope.formData.Error.common = "Please provide your salary slab.";
            } else if (!$scope.formData.occupation) {
                $scope.formData.Error.occupation = "Please provide your occupation.";
                $scope.formData.Error.common = "Please provide your occupation.";
            } else if (!$scope.formData.pep) {
                $scope.formData.Error.pep = "Please provide your political relation.";
                $scope.formData.Error.common = "Please provide your political relation.";
            } else if (!$scope.formData.bankAcc) {
                $scope.formData.Error.bankAcc = "Please provide your bank account number.";
                $scope.formData.Error.common = "Please provide your bank account number.";
            } else if (!$scope.formData.ifsc) {
                $scope.formData.Error.ifsc = "Please provide your bank IFSC.";
                $scope.formData.Error.common = "Please provide your bank IFSC.";
            } else if (!$scope.formData.bankDetails.IFSC) {
                $scope.formData.Error.ifsc = "Please provide a valid IFSC.";
                $scope.formData.Error.common = "Please provide a valid IFSC.";
            } else if (!$scope.formData.agree) {
                $scope.formData.Error.agree = "You're requred to agree to following terms";
                $scope.formData.Error.common = "You're requred to agree to following terms";
            } else {
                $scope.submitFATCA();
            }
        };

        $scope.getIFSC = function() {
            $scope.loading = true;
            $scope.formData.ifsc = ($scope.formData.ifsc || "").toUpperCase();
            $http({
                method: 'GET',
                url: Config.API.getIFSC + "?IFSC=" + $scope.formData.ifsc,
            }).then(function successCallback(response) {
                $scope.loading = false;
                // console.log("successCallback", response);
                if (response.data.IFSC == $scope.formData.ifsc) {
                    $scope.formData.bankDetails = response.data;
                } else if (response.data.status == 403) {
                    $location.path("/");
                }
            }, function errorCallback(error) {
                $scope.loading = false;
                console.log("failCallback", error);
            });
        };

        $scope.submitFATCA = function() {
            $scope.loading = true;
            // 
            $http({
                method: 'POST',
                url: Config.API.updateFATCA,
                data: {
                    email: $scope.formData.email,
                    dob: $scope.formData.dob,
                    birthState: $scope.enum.birthState[$scope.formData.birthState],
                    birthStateCode: $scope.formData.birthState,
                    PEP: $scope.formData.pep,
                    occupationCode: $scope.formData.occupation,
                    incomeSlab: $scope.formData.salarySlab,
                    IFSC: $scope.formData.ifsc,
                    accountNumber: $scope.formData.bankAcc,
                    accountType: $scope.formData.accountType,
                    bankDetails: JSON.stringify($scope.formData.bankDetails),
                }
            }).then(function successCallback(response) {
                $scope.loading = false;
                console.log("successCallback", response);
                if (response.data.success && response.data.hasFolio >= 1) {
                    $location.path($scope.Path.MyAccount);
                } else if (response.data.status == 403) {
                    $location.path("/");
                } else {
                    swal("Uh Oh!", response.data.message || "Something went wrong, please try after sometime.", "error");
                }
            }, function errorCallback(error) {
                console.log("failCallback", error);
                $scope.loading = false;
            });
        };

        // -----------------------------------------------------
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

    }
]);