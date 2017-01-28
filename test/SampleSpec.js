// Loads the module we want to test
require('angular');
var inbredService = require('../public/scripts/components/services/SearchInbredsService');
describe('User service', function() {
    beforeEach(ngModule('ProductNomenclatureApp'));

    it('should return a list of users', inject(function(inbredService) {
        assert.equal(inbredService.getCrops("localhost:8000","Some r").length, 0);
    }));
});