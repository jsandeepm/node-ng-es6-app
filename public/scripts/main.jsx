import es6Promise from 'es6-promise';
import React from 'react';
import ReactDOM from 'react-dom';
var $ = require("jquery/dist/jquery");
import moment from 'moment';
import angular from 'angular';
import packageJson from '../../package.json';
import ProductNomenclatureApp from './app';

es6Promise.polyfill()
angular.bootstrap(document, [ProductNomenclatureApp]);
