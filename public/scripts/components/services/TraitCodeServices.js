/**
 * Created by ESLANK on 7/12/2016.
 */
import serviceModule from '../config/ServiceModule';
import '../config/CommonService';

class TraitCodeServices {
    constructor(CommonService, $q) {
        this.commonService = CommonService;
        this.q = $q;
    }

    getTraitCodes(url, input, headers, successMessage) {
        return this.commonService.postData(url, input, headers, successMessage);
    };

    getHerbicideCodes(url, errorMessage) {
        return this.commonService.getData(url, errorMessage);
    };

    saveTraits(url, input, headers, successMessage) {
        var defer = this.q.defer();
        this.commonService.postData(url, input, headers, successMessage).then((data) => {
            defer.resolve(data);
        });
        return defer.promise;
    };
}
;

TraitCodeServices.$inject = ['CommonService', '$q'];
export default serviceModule.service('TraitCodeServices', TraitCodeServices).name;