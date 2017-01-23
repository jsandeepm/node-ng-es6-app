/**
 * Created by SMALA on 7/1/2016.
 */

import * as services from '../config/ServiceURLMapper';
import '../services/SearchInbredsService';
import controllerModule from '../config/ControllerModule';
import _ from 'underscore';
require('block-ui');

const PEDIGREE_SEARCH_SERVICE = 'https://' + services.rowCropNamingService() + '/services/rest/inbredDataService/getInbredDetails';
const SAVE_SERVICE = 'https://' + services.rowCropNamingService() + '/services/rest/inbredDataService/saveInbredDetails';
const GET_CROPS_SERVICE = 'https://' + services.rowCropNamingService() + '/services/rest/inbredDataService/getRowCrops';
const GET_GERMPLASAM_SERVICE = 'https://' + services.rowCropNamingService() + '/services/rest/germplasmDataService/getGermplasmDetails';

class SearchInbredsController {

    constructor(SearchInbredsService) {
        this.searchInbredsService = SearchInbredsService;
        this.crops = [];
        this.form = {};
        this.pedigreeResultExists = false
        this.searchResult = {
            pedigreeErrors: [],
            needNamePedigrees: [],
            alreadyNamedPedigrees: [],
            basePedigreeErrors: []
        };
        this.headers = {'Content-Type': 'application/json'};
        this.needNamePedigreesResponse = [];
        this.needNamePedigreeReciprocal = [];
        this.inbredPedigrees = [];
        this.multiCrossPedigrees = [];
        this.namedPedigrees = [];
        this.transgenicPedigrees = [];
        this.traitVersionEditable = {
            selected: {},
            index: -1
        };
        this.germplasmInput = {
            pedigreeNames: this.form.hybrids,
            cropName: this.form.crop
        };
        this.errorTransgenicPedigrees = "";
    };

    getInbreds() {
        this.jsonData = {
            namedPedgriess: this.namedPedigrees,
            multiCrossPedigrees: this.multiCrossPedigrees,
            inbredPedigrees: this.inbredPedigrees,
            cropName: this.form.crop,
            transgenicPedigrees: this.transgenicPedigrees

        };

        this.searchInbredsService.getInbreds(PEDIGREE_SEARCH_SERVICE, this.jsonData, this.headers, "success").then((data) => {
            if (!_.isEmpty(data.basePedigreeErrors)) {
                this.searchResult.basePedigreeErrors = data.basePedigreeErrors;
                this.sortPedigreesErrors(this.searchResult.basePedigreeErrors);
                this.selectAllBasePedigrees(true)
            }
            if (!_.isEmpty(data.pedigreeErrors)) {
                this.searchResult.pedigreeErrors = this.searchResult.pedigreeErrors.concat(data.pedigreeErrors);
            }

            if (!_.isEmpty(data.alreadyNamed)) {
                this.searchResult.alreadyNamedPedigrees = data.alreadyNamed;
                this.sortPedigrees(this.searchResult.alreadyNamedPedigrees);
            }
            if (!_.isEmpty(data.needNamed)) {
                this.searchResult.needNamePedigrees = data.needNamed;
                _.each(this.searchResult.needNamePedigrees, (needNamePedigree, i) => {
                    if (!_.isEmpty(this.needNamePedigreesResponse)) {
                        _.each(this.needNamePedigreesResponse, (needNamedResponse, j)=> {
                            if (needNamePedigree.inbredName === needNamedResponse.pedigreeName) {
                                needNamePedigree.comment = needNamedResponse.comment;
                            }
                            _.each(this.validReciprocalPedigrees, (reciprocal)=> {
                                if (needNamePedigree.inbredName === reciprocal.reciprocalPedigreeKey) {
                                    needNamePedigree.reciprocalGermplasmId = reciprocal.germplasmId;
                                    needNamePedigree.reciprocalPedigreeName = reciprocal.pedigreeName;
                                    needNamePedigree.isvalidReciprocal = true;
                                    //TODO: break
                                }
                            });
                        });
                    }

                });
                this.sortPedigrees(this.searchResult.needNamePedigrees);
            }
            this.selectAll(true);
            this.sortPedigreesErrors(this.searchResult.pedigreeErrors);
            $.unblockUI();
        });
    };

    loadCrops() {
        this.searchInbredsService.getCrops(GET_CROPS_SERVICE, "Unable to get crops").then((data) => {
            this.crops = data;
        });
    };

    search() {
        this.traitVersionEditable.selected = {};
        this.errorTransgenicPedigrees = "";
        this.traitVersionEditable.index = -1;
        this.pedigreeResultExists = false;
        $.blockUI({message: "<span class='velocity-spinner'></span> <span> Searching Inbred... </span>"});
        this.searchResult = {
            pedigreeErrors: [],
            needNamePedigrees: [],
            alreadyNamedPedigrees: [],
            validReciprocalPedigrees: [],
            basePedigreeErrors: []
        };

        this.namedPedigrees = [];
        this.multiCrossPedigrees = [];
        this.inbredPedigrees = [];
        this.validReciprocalPedigrees = [];
        this.transgenicPedigrees = [];
        this.germplasmInput = {
            pedigreeNames: this.form.hybrids,
            cropName: this.form.crop
        };
        this.needNamePedigreesResponse = [];
        this.searchInbredsService.getGermplasms(GET_GERMPLASAM_SERVICE, this.germplasmInput, this.headers, "success")
            .then((data) => {
                this.needNamePedigreesResponse = data.needNamePedigrees;
                this.namedPedigrees = data.alreadyNamedPedigrees;
                this.validReciprocalPedigrees = data.validReciprocalPedigrees;
                this.inbredPedigrees = data.inbredPedigrees;
                this.multiCrossPedigrees = data.multiCrossPedigrees;
                this.transgenicPedigrees = data.transcagenicPedigrees;
                this.getInbreds();
                if (!_.isEmpty(data.pedigreeErrors)) {
                    this.searchResult.pedigreeErrors = data.pedigreeErrors;
                }
                this.isPedigreeResultExists();
                this.sortPedigreesErrors(this.searchResult.pedigreeErrors);
            });
    };

    resetTransgenicPedigreesError() {
        this.errorTransgenicPedigrees = "";
    }

    saveInbredDetails() {
        this.errorTransgenicPedigrees = "";
        var transgenicTraitIndex = [];
        this.pedigreesTobeSaved = [];
        _.each(this.searchResult.needNamePedigrees, (inbred) => {
            if (inbred.checked) {
                //temporary inbred details to omit the key checked
                var tempInbred = _.omit(inbred, 'checked');
                if (tempInbred.isTransgenic && (_.isEmpty(tempInbred.traitVersion) || _.isEmpty(tempInbred.traitVersion))) {
                    transgenicTraitIndex.push(tempInbred.inbredName);
                } else {
                    this.pedigreesTobeSaved.push(tempInbred);
                }
            }
        });
        if (transgenicTraitIndex.length > 0) {
            this.errorTransgenicPedigrees = transgenicTraitIndex.join();
            return;
        }

        this.jsonData = {
            pedigreesTobeSaved: this.pedigreesTobeSaved,
            cropName: this.form.crop
        };
        if (this.pedigreesTobeSaved.length > 0) {
            $.blockUI({message: "<span class='velocity-spinner'></span> <span> Saving Pedigrees... </span>"});
            this.searchInbredsService.saveInbreds(SAVE_SERVICE, this.jsonData, this.headers, "success").then((data) => {
                this.returnMsg = data
                if (this.returnMsg == 'success') {
                    //looping through temporary pedigrees to avoid dynamic deletion
                    var tempPedigrees = angular.copy(this.pedigreesTobeSaved);
                    _.each(tempPedigrees, (inbred, index) => {
                        this.searchResult.alreadyNamedPedigrees.push(inbred);
                        this.deleteSavedPedigree(inbred.inbredName);
                    });
                }
                $.unblockUI();
            });
        }
    }

    //Deletes the saved pedigree from need name pedigrees
    deleteSavedPedigree(inbredName) {
        var needNamedPedigrees = angular.copy(this.searchResult.needNamePedigrees);
        _.each(needNamedPedigrees, (inbred, index)=> {
            if (inbred.inbredName == inbredName) {
                this.searchResult.needNamePedigrees.splice(index, 1);
            }
        });
    }

    //Fetch conventinal pedigrees
    fetchConventinalPedigrees() {
        this.conventinalPedigrees = [];
        _.each(this.searchResult.basePedigreeErrors, (basePedigree) => {
            if (basePedigree.checked) {
                this.conventinalPedigrees.push(basePedigree.conventinalPedigrees[0]);
            }
        });
        this.form.hybrids = this.conventinalPedigrees.join();
        this.search();
    }

    splitString(padigrees) {
        return padigrees.split(",");
    };

    replaceSpacesAndNewLines() {
        if (this.form.hybrids) {
            this.form.hybrids = this.form.hybrids.replace(/\s+/g, ",");
        }
    };

    sortPedigrees(pedigrees) {
        pedigrees.sort(function (a, b) {
            return (a.inbredName > b.inbredName ? 1 : -1);
        });
    };

    sortPedigreesErrors(pedigreeError) {
        pedigreeError.sort(function (a, b) {
            return (a.pedigreeName > b.pedigreeName ? 1 : -1);
        });
    };

    selectAll(checked) {
        _.each(this.searchResult.needNamePedigrees, (inbred) => {
            inbred.checked = checked;
        });
    };

    selectAllBasePedigrees(checked) {
        _.each(this.searchResult.basePedigreeErrors, (basePedigree) => {
            basePedigree.checked = checked;
        });
    };

    isPedigreeResultExists() {
        if (!_.isEmpty(this.searchResult))
            return this.pedigreeResultExists = true;
        return this.pedigreeResultExists;
    };

    getTraitVersionNameTemplate(entry, index) {
        if (!_.isNull(this.traitVersionEditable.selected) && !_.isUndefined(this.traitVersionEditable.selected)
            && entry.baseManufacturingCode === this.traitVersionEditable.selected.baseManufacturingCode
            && index === this.traitVersionEditable.index) {
            return 'edit';
        } else {
            return 'display';
        }
    };

    editTraitVersionName(entry, index) {
        this.traitVersionEditable.selected = angular.copy(entry);
        this.traitVersionEditable.index = index;
    };

    saveTraitVersionName(idx) {
        if (!_.isNull(this.traitVersionEditable.selected) && !_.isUndefined(this.traitVersionEditable.selected)) {
            this.searchResult.needNamePedigrees[idx].traitVersion = angular.copy(this.traitVersionEditable.selected.traitVersion.toUpperCase());
            this.resetTraitVersionName();
        }
    };

    resetTraitVersionName() {
        this.traitVersionEditable.selected = {};
    };
}

SearchInbredsController.$inject = ['SearchInbredsService'];
export default controllerModule.controller('SearchInbredsController', SearchInbredsController).name;