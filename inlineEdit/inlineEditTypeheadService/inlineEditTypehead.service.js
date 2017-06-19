(function () {
    'use strict';

    function InlineEditTypehead(EditFilters, ProgrammesRest, ScenariosManager) {
        this.EditFilters = EditFilters;
        this.ProgrammesRest = ProgrammesRest;
        this.ScenariosManager = ScenariosManager;
        this.categoryDisabled = false;
        this.loadingMatchingProgrammes = false;
        this.programmeSearchResults = [];

        this.editedData = {
            description: {
                value: null,
                disabled: false
            },
            categories: {
                value: null
            },
            shortName: {
                value: null
            }
        };
    }

    InlineEditTypehead.prototype.programmeSearch = function (searchString) {
        let requestParams = {
            searchString: searchString
        };
        this.loadingMatchingProgrammes = true;
        this.ProgrammesRest.searchLus(requestParams)
            .then(response => this.programmeSearchResults = response.programmes)
            .catch((data) => data)
            .finally(() => this.loadingMatchingProgrammes = false);
    };

    InlineEditTypehead.prototype.changeProgrammeName = function (programme) {
        this.programmeSearchResults.length = 0;
        this.categoryDisabled = true;
        this.editedData.description.value = programme.name;
        this.editedData.shortName.value = programme.shortName;
        this.editedData.categories.value = programme.category;
    };

    InlineEditTypehead.prototype.reset = function () {
        this.programmeSearchResults = [];
        this.editedData.description.value = '';
        this.editedData.shortName.value = '';
        this.editedData.categories.value = '';
    };

    InlineEditTypehead.prototype.isSet = function () {
        return !!this.editedData.description.value &&
            this.editedData.description.value.length > 0;
    };
    angular.module('utils').service('InlineEditTypehead', InlineEditTypehead);
})();
