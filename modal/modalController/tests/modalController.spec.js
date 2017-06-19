'use strict';
// These tests have been written with Jasmine 2.0

describe('The ModalController\n', function() {

    var scope, createController, ModalController, ModalService;
    beforeEach(module('edit'));
    beforeEach(inject(
      function($controller, $rootScope, _ModalService_) {
          scope = $rootScope.$new();
          ModalService = _ModalService_;

          createController = function() {
            return $controller('ModalController as modal', {
              '$scope': scope
            });
          };

      }));

    it('Injects modal services ', function() {
        createController();
        expect(scope.modal.ModalService).toEqual(ModalService);
    });

});