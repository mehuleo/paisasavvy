PaisaSavvy.controller('Chat', [
    '$scope', '$location', '$http', 'Config', '$timeout',
    function($scope, $location, $http, Config, $timeout) {
        // init
        document.getElementById('aa').addEventListener("touchmove", function(event) {
            event.preventDefault();
            event.stopPropagation();
        }, false);

        $scope.maxWidth = document.documentElement.clientWidth || window.innerWidth || 700;
        $scope.maxWidth = Math.min($scope.maxWidth, 700) - 40;
        $scope.maxWidth = Math.floor($scope.maxWidth * .9);

        // 
        $scope.messages = [];
        $scope.key = 'aa';
        $scope.listP = 0;
        $scope.uId = 0;
        // 
        $scope.data = {
            aa: {
                list: [
                    "Hello paisa savvy investor! 🤗",
                ],
                actions: [{
                    label: "Hi",
                    goto: "a",
                }],
            },a: {
                list: [
                    "In this lesson we will learn:",
                    "1. Why wealth preservation is important than growth?",
                    "2. Why high return comes with high risk?",
                    "3. And how much risk one should take?",
                ],
                actions: [{
                    label: "Lets get started",
                    goto: "b",
                }],
            },
            b: {
                list: [
                    "When you don't need your money your investment will be generating good returns. But when you'll be in need you will be making losses.",
                    "So why to invest if your savings are useless in need?",
                ],
                actions: [{
                    label: "Why is that?",
                    goto: "c",
                }],
            },
            c: {
                list: [
                    "Because,",
                    "Your investments generate high return when economy is booming, and make loses when economy is down.",
                    "In good economy people have jobs, steady income and extra money to save.",
                    "But in downturn people face job losses, delayed salaries, higher expenses and they need to relay on their savings but this is also the time when your savings are making losses.",
                ],
                actions: [{
                    label: "So, what is the solution?",
                    goto: "d",
                }],
            },
            d: {
                list: [
                    "To know the solution you need to understand risk, return and beta.",
                    "",
                    "Say, SENSEX generates return of 10% and your investment generate return of 30% means the Beta value of your investment is 3.",
                    "This also means if SENSEX will go down by 10% your investment will go down by 30%.",
                    "",
                    "So, more return means higher the risk and higher the beta.",
                ],
                actions: [{
                    label: "Okay, Got it.",
                    goto: "e",
                }, {
                    label: "Tell me more about the Beta",
                    goto: "",
                }],
            },
            e: {
                list: [
                    "The Savings in need is the savings indeed!",
                    "",
                    "The ideal Beta(risk) on your savings should be little less than 1, that means you get less return but importantly you make little loss in worst market condition.",
                ],
                actions: [{
                    label: "Okay...",
                    goto: "f",
                }, {
                    label: "How to calculate the Beta of my investments?",
                    goto: "",
                }],
            },
            f: {
                list: [
                    "Remember everyone can get good return in a good market, but the Paisa Savvy person knows how to preserve money when everyone else is loosing their money in tough times.",
                    "",
                    "That was it",
                    "Happy Investing!",
                ],
                actions: [],
            },
        };

        $scope.type = function() {
            if($scope.listP < $scope.data[$scope.key].list.length) {
                $scope.uId++;
                $scope.messages.push({
                    type: 'ellipsis',
                    text: '...',
                    ftext: $scope.data[$scope.key].list[$scope.listP],
                    uid: $scope.uId,
                });
                $timeout(function(){
                    var msg = $scope.messages[$scope.messages.length - 1];
                    if(msg.type == 'ellipsis') {
                        msg.type = "utext";
                        msg.text = msg.ftext;
                        document.getElementById(msg.uid).style.maxWidth = $scope.maxWidth + "px";
                        window.scrollTo(0,document.body.scrollHeight);
                    }
                }, 1000);
                // 
                var txt= $scope.data[$scope.key].list[$scope.listP];
                var delay = (txt.match(/ /ig) || []).length || 1;
                delay = Math.ceil(delay/ 3.5) * 1000;
                // 
                $scope.listP++;
                $timeout($scope.type, delay);
            } else {
                $scope.addActions();
            }
            
        };

        $scope.addActions = function() {
            for(var i in $scope.data[$scope.key].actions) {
                var act = $scope.data[$scope.key].actions[i];
                $scope.uId++;
                $scope.messages.push({
                    type: 'action',
                    text: act.label,
                    goto: act.goto,
                    uid: $scope.uId,
                });
                // 
                window.scrollTo(0,document.body.scrollHeight);
            }
            window.scrollTo(0,document.body.scrollHeight);
        };

        $scope.goto = function(data) {
            if(!data.goto) return;

            while($scope.messages[$scope.messages.length - 1].type == 'action') {
                $scope.messages.pop();
            }
            $scope.uId++;
            $scope.messages.push({
                type: 'metext',
                text: data.text,
                uid: $scope.uId,
            });
            // 
            $scope.listP = 0;
            $scope.key = data.goto;
            $scope.type();
        };

        $scope.type();
        // $scope.remove
    }
]);