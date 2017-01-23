import angular from 'angular'

var httpConfig = angular.module('httpConfig', [])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.withCredentials = true;
    }])
    .name;

export default httpConfig;