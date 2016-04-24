'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
    global Firebase
    global angular
*/

// Firebase
var ref = new Firebase('https://scorching-inferno-8541.firebaseio.com');
var demoRef = ref.child('demo');
var userRef = ref.child('users');

var mainApp = angular.module('mainApp', ['ui.router', 'firebase', 'ja.qr', 'qrScanner']).config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'templates/home.html',
        controller: function controller($scope) {
            $scope.setPageTitle('Home');
        }
    }).state('about', {
        url: '/about',
        templateUrl: 'templates/about.html',
        controller: function controller($scope) {
            $scope.setPageTitle('About');
        }
    }).state('firebase', {
        url: '/firebase',
        templateUrl: 'templates/firebase.html',
        controller: function controller($scope, $firebaseObject, $firebaseArray, $firebaseAuth) {
            $scope.setPageTitle('Firebase');

            $scope.firebaseDemo = $firebaseArray(demoRef);
            $scope.firebaseUers = $firebaseArray(userRef);

            var auth = $firebaseAuth(ref);

            console.log('authData:', ref.getAuth());

            // function
            $scope.addData = function (newData) {
                return $scope.firebaseDemo.$add(newData);
            };

            $scope.facebookAuth = function () {
                auth.$authWithOAuthPopup('facebook', { remember: 'default', scope: 'email,user_likes,user_friends' }).then(function (authData) {
                    // 利用token 拿取各scope資料 ex: https://graph.facebook.com/v2.5/me/friends?access_token=...
                    console.log('Logged in as:', authData.uid);
                    console.log('authData.facebook', authData.facebook);
                    $scope.authData = authData;
                    $scope.facebookData = authData.facebook;
                }).catch(function (error) {
                    console.log('Authentication failed:', error);
                });
            };
            // firebase query test
            // age: 35~40
            demoRef.orderByChild("age").startAt(35).endAt(40).once("value", function (snapshot) {
                console.log(snapshot.val());
            });

            // age = 36
            demoRef.orderByChild("age").equalTo(36).once("value", function (snapshot) {
                console.log(snapshot.val());
            });

            // name: 只找A開頭的
            demoRef.orderByChild('name').startAt('A').endAt('B').once('value', function (snapshot) {
                console.log(snapshot.val());
            });
        }
    }).state('rwd', {
        url: '/rwd',
        templateUrl: 'templates/rwd.html',
        controller: function controller($scope) {
            $scope.setPageTitle('RWD');
        }
    }).state('qr', {
        url: '/qr',
        templateUrl: 'templates/qr.html',
        controller: function controller($scope) {
            $scope.setPageTitle('QR');

            $scope.onSuccess = function (data) {
                console.log(data);
            };
            $scope.onError = function (error) {
                console.log(error);
            };
            $scope.onVideoError = function (error) {
                console.log(error);
            };
        }
    });
    $urlRouterProvider.otherwise('/');
}).controller('MainController', function ($scope, $http, $location, $firebaseObject, $firebaseArray) {
    $scope.setPageTitle = function (pageTitle) {
        $scope.pageTitle = pageTitle;
    };
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
    $scope.templates = {
        nav: 'templates/nav.html',
        footer: 'templates/footer.html'
    };
});

exports.default = mainApp;


angular.element(document).ready(function () {
    return angular.bootstrap(document, ['mainApp']);
});