/**
 * Created by SMALA on 7/2/2016.
 */

import serviceModule from '../config/ServiceModule';
import '../config/CommonService';
import _ from 'underscore';

class SearchInbredsService {

    constructor(CommonService, $q) {
        this.commonService = CommonService;
        this.q = $q;
    }

    getCrops(url, errorTitle) {
        var defer = this.q.defer();
        this.commonService.getData(url, errorTitle).then((data) => {
            defer.resolve(data);
        });
        return defer.promise;
    };

    getInbreds(url, input, headers, successMessage) {
        return this.commonService.postData(url, input, headers, successMessage);
    };

    saveInbreds(url, input, headers, successMessage) {
        var defer = this.q.defer();
        this.commonService.postData(url, input, headers, successMessage).then((data) => {
            defer.resolve(data);
        });
        return defer.promise;
    };

    getGermplasms(url, input, headers, successMessage) {
        return this.commonService.postData(url, input, headers, successMessage)

    };

    allCompleteForHybridService(promises, parentalGermplasams, notParental, allGermplasams) {

        var deferred = this.q.defer();
        var passed = 0;
        var failed = 0;
        var responses = [];
        var inbredPedigrees = [];
        var multiCrossPedigrees = [];
        var lineTypeInvalidPedigrees = [];
        _.each(promises, function (promise, index) {
            promise
                .then(function (result) {
                    parentalGermplasams.push(allGermplasams[index]);
                    if (allGermplasams[index].lineType == 'Finished') {
                        inbredPedigrees.push(allGermplasams[index].pedigreeName);
                    } else if (allGermplasams[index].lineType == 'Hybrid') {
                        multiCrossPedigrees.push(allGermplasams[index].pedigreeName);
                    } else {
                        lineTypeInvalidPedigrees.push({
                            pedigreeName: allGermplasams[index].pedigreeName,
                            errorDescription: "Line Type of this pedigree Invalid"
                        });
                    }
                    passed++;
                })
                .catch(function (result) {
                    failed++;
                    notParental.push({
                        pedigreeName: allGermplasams[index].pedigreeName,
                        errorDescription: "This pedigree is not a parental line"
                    });
                })
                .finally(function () {
                    if ((passed + failed) == promises.length) {
                        responses["parentalGermplasams"] = parentalGermplasams;
                        responses["notParentalGermplasams"] = notParental;
                        responses["inbredPedigrees"] = inbredPedigrees;
                        responses["multiCrossPedigrees"] = multiCrossPedigrees;
                        responses["lineTypeInvalidPedigrees"] = lineTypeInvalidPedigrees;
                        deferred.resolve(responses);
                    }
                });
        });

        return deferred.promise;
    };
}
SearchInbredsService.$inject = ['CommonService', '$q'];
export default serviceModule.service('SearchInbredsService', SearchInbredsService).name;