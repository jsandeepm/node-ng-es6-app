import * as services from '../config/ServiceURLMapper';
import '../services/TraitCodeServices';
import controllerModule from '../config/ControllerModule';
import _ from 'underscore';
require('block-ui');

const GET_CROPS_SERVICE = 'https://' + services.rowCropNamingService() + '/services/rest/inbredDataService/getRowCrops';
const GET_TRAIT_INFO = 'https://' + services.rowCropNamingService() + '/services/rest/traitDataService/traitDetails';
const SAVE_SERVICE = 'https://' + services.rowCropNamingService() + '/services/rest/traitDataService/saveTraitDetails';

class TraitCodeController {

    constructor(TraitCodeServices, SearchInbredsService) {
        this.traitCodeServices = TraitCodeServices;
        this.searchInbredsService = SearchInbredsService;
        this.crops = [];
        this.herbicideCodes = require('../data/herbicideCodes.json');
        this.traitResults = false;
        this.generatedTraits = false;
        this.form = {
            events: []
        };
        this.tags = [
            {text: 'Tag1'},
            {text: 'Tag2'},
            {text: 'Tag3'}
        ];
        this.headers = {
            'Content-Type': 'application/json'
        };
    };

    loadCrops() {
        this.searchInbredsService.getCrops(GET_CROPS_SERVICE, "Unable to get crops").then((data) => {
            this.crops = data;
        });
    };

    search() {
        this.traitResults = false;
        this.showWarning = false;
        this.showError = false;
        $.blockUI({message: "<span class='velocity-spinner'></span> <span> Loading Traits... </span>"});
        this.jsonData = {
            eventNames: this.form.events,
            cropName: this.form.crop
        };
        this.searchResult = {
            existingTraits: [],
            suggestedTraits: [],
            errorTraits: []
        };
        this.traitCodeServices.getTraitCodes(GET_TRAIT_INFO, this.jsonData, this.headers, "success").then((data) => {
            this.searchResult.existingTraits = data.existingTraits;
            this.searchResult.suggestedTraits = data.suggestedTraits;
            this.searchResult.errorTraits = data.erredTraits;
            this.isTraitCodesExists();
            //this.selectAll(true);
            $.unblockUI();
        });
    };

    isTraitCodesExists() {
        if (!_.isEmpty(this.searchResult))
            return this.traitResults = true;
        return this.traitResults;
    };

    validateTraits() {
        this.invalidTraits = [];
        _.each(this.searchResult.suggestedTraits, (trait) => {
            if (trait.checked) {
                //temporary trait details to omit the key checked
                //trait.stackAbbr != null && trait.stackDesc != null && trait.herbicideCode != null
                if (!(this.isEmpty(trait.stackAbbr) || this.isEmpty(trait.stackDesc) || this.isEmpty(trait.herbicideCode))) {
                    var tempTrait = _.omit(trait, 'checked');
                    this.traitsTobeSaved.push(tempTrait);
                }
                else {
                    this.invalidTraits.push(trait.eventName);
                }
            }
        });
        return this.invalidTraits;
    }

    saveTraits() {
        this.saveResult = {
            savedTraits: [],
            errorTraits: []
        };
        this.showWarning = false;
        this.showError = false;
        this.traitsTobeSaved = [];
        this.validateTraits();
        if (_.isEmpty(this.invalidTraits)) {
            this.jsonData = {
                traitsTobeSaved: this.traitsTobeSaved,
            };
            if (this.traitsTobeSaved.length > 0) {
                $.blockUI({message: "<span class='velocity-spinner'></span> <span> Saving Traits... </span>"});
                //looping through temporary pedigrees to avoid dynamic deletion
                this.traitCodeServices.saveTraits(SAVE_SERVICE, this.traitsTobeSaved, this.headers, "success").then((data) => {
                    //this.returnMsg = data;
                    this.saveResult.errorTraits = data.erredTraits;
                    //if (this.returnMsg == 'success') {
                    var tempTraits = angular.copy(this.traitsTobeSaved);
                    _.each(tempTraits, (trait, index) => {
                        //Check if trait existed in errorTraits from save service
                        var isErrorWhileSavingTrait = false;
                        var tempErrorTrait = {};
                        _.each(this.saveResult.errorTraits, (errorTrait, index) => {
                            if (trait.eventName == errorTrait.eventName) {
                                isErrorWhileSavingTrait = true;
                                tempErrorTrait = errorTrait;
                            }
                        });
                        if (isErrorWhileSavingTrait) {
                            this.errorMessage = "Errors while saving, Please check in errors tab";
                            this.showError = true;
                            this.searchResult.errorTraits.push(tempErrorTrait);
                        }
                        else {
                            this.searchResult.existingTraits.push(trait);
                            this.deleteSavedTrait(trait.eventName);
                        }
                    });
                    //}
                    $.unblockUI();
                });
            }
        }
        else {
            this.showWarning = true;
        }
    };

    //Deletes the saved traits from suggested traits
    deleteSavedTrait(eventName) {
        var suggestedTraits = angular.copy(this.searchResult.suggestedTraits);
        _.each(suggestedTraits, (trait, index)=> {
            if (trait.eventName == eventName) {
                this.searchResult.suggestedTraits.splice(index, 1);
            }
        });
    }

    selectAll(checked) {
        _.each(this.searchResult.suggestedTraits, (entry) => {
            entry.checked = checked;
        });
    };

    countCheckedTraits() {
        var count = 0;
        _.each(this.searchResult.suggestedTraits, (entry) => {
            if (entry.checked) {
                count++;
            }
        });
        return count;
    }

    isEmpty(str) {
        return typeof str == 'string' && !str.trim() || typeof str == 'undefined' || str === null;
    }

    clearEvents() {
        this.form.events = [];
    }
}
;

TraitCodeController.$inject = ['TraitCodeServices', 'SearchInbredsService'];
export default controllerModule.controller('TraitCodeController', TraitCodeController).name;