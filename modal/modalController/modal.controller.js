(function() {

    'use strict';

    function ModalController(ModalService) {
        this.ModalService = ModalService;
    }

    angular.module('modal').controller('ModalController', ModalController);

})();