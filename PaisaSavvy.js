var PaisaSavvy = angular.module('PaisaSavvy', ['ngRoute', 'ngMaterial', 'ngSanitize']);

PaisaSavvy.filter('IndianCurrency', function() {
    return function(data, withoutPaisa) {
        return Number(data || 0).toLocaleString('en-IN', { 
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: withoutPaisa ? 0 : 2,
            minimumFractionDigits: withoutPaisa ? 0 : 2,
            currencyDisplay: 'name'
        }).replace(" Indian rupees", '');
    };
});

PaisaSavvy.config(function($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            controller: 'Landing2',
            templateUrl: 'pages/Landing3.html',
        })
        .when('/login', {
            controller: 'Landing2',
            templateUrl: 'pages/Login.html',
        })
        .when('/mobile/login', {
            controller: 'Landing2',
            templateUrl: 'pages/Login.html',
        })
        .when('/mobile/', {
            controller: 'Landing2',
            templateUrl: 'pages/MobileLanding.html',
        })
        .when('/KYCCheck', {
            controller: 'KYCCheck',
            templateUrl: 'pages/KYCCheck.html',
        })
        .when('/mobile/KYCCheck', {
            controller: 'KYCCheck',
            templateUrl: 'pages/MobileKYCCheck.html',
        })
        .when('/KYCReCheck', {
            controller: 'KYCCheck',
            templateUrl: 'pages/KYCReCheck.html',
        })
        .when('/mobile/KYCReCheck', {
            controller: 'KYCCheck',
            templateUrl: 'pages/MobileKYCReCheck.html',
        })
        .when('/AadhaarKYC', {
            controller: 'AadhaarKYC',
            templateUrl: 'pages/AadhaarKYC.html',
        })
        .when('/mobile/AadhaarKYC', {
            controller: 'AadhaarKYC',
            templateUrl: 'pages/MobileAadhaarKYC.html',
        })
        .when('/ClientDetails', {
            controller: 'ClientDetails',
            templateUrl: 'pages/ClientDetails.html',
        })
        .when('/mobile/ClientDetails', {
            controller: 'ClientDetails',
            templateUrl: 'pages/MobileClientDetails.html',
        })
        .when('/CreateFolio', {
            controller: 'CreateFolio',
            templateUrl: 'pages/CreateFolio.html',
        })
        .when('/MyAccount', {
            controller: 'MyAccount',
            templateUrl: 'pages/MyAccount.html',
        })
        .when('/mobile/MyAccount', {
            controller: 'MyAccount',
            templateUrl: 'pages/MobileMyAccount.html',
        })
        .when('/debitCardApplication', {
            controller: 'DebitCardApplication',
            templateUrl: 'pages/DebitCardApplication.html',
        })
        .when('/faq', {
            controller: 'FAQ',
            templateUrl: 'pages/FAQ.html',
        })
        .when('/investmentCalculator', {
            controller: 'Landing2',
            templateUrl: 'pages/InvCalc.html',
        })
        // .when('/KarvyKYC', {
        //     controller: 'KarvyKYC',
        //     templateUrl: 'pages/KarvyKYC.html',
        // })
        // .when('/invest', {
        //     controller: 'Invest',
        //     templateUrl: 'pages/invest.html',
        // })
        // .when('/payment', {
        //     controller: 'Payment',
        //     templateUrl: 'pages/payment.html',
        // })
        // .when('/paymentfailed', {
        //     controller: 'Payment',
        //     templateUrl: 'pages/payment.html',
        // })
        // .when('/paymentsuccess', {
        //     controller: 'sPayment',
        //     templateUrl: 'pages/spayment.html',
        // })
        // .when('/advise', {
        //     controller: 'Advise',
        //     templateUrl: 'pages/advise.html',
        // })
        // .when('/chat', {
        //     controller: 'Chat',
        //     templateUrl: 'pages/chat.html',
        // })
        .otherwise({
            redirectTo: '/'
        });
});