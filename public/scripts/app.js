/**
 * Created by SMALA on 7/2/2016.
 */

import angular from 'angular';
import 'angular-route';
import 'angular-sanitize';
import 'angular-messages';
import 'ui-select';
require('select2');
require("bootstrap-webpack!./components/config/bootstrap.config");
import InbredsTemplate from './components/partials/InbredsTemplate';
import TraitCodeTemplate from './components/partials/TraitCodeTemplate';
import httpConfig from './components/config/http-config';
import SearchInbredsController from './components/controllers/SearchInbredsController';
import TraitCodeController from './components/controllers/TraitCodeController';

const ProductNomenclatureApp = 'ProductNomenclatureApp';

angular.module(ProductNomenclatureApp, ['ngRoute', 'ngSanitize', 'ControllerModule', 'ServiceModule', 'ui.select', 'httpConfig','ngMessages'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/generate/product-name', {
                template: InbredsTemplate,
                controller: 'SearchInbredsController as sic'
            })
            .when('/generate/trait-code', {
                template: TraitCodeTemplate,
                controller: 'TraitCodeController as tic'
            })
            .otherwise("/generate/product-name");
        $locationProvider.html5Mode(true);
    }]);

export default ProductNomenclatureApp;