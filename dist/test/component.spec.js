define(["require", "exports", "virtual-dom", "./../src/component", "chai", "./mockStore"], function (require, exports, virtual_dom_1, component_1, chai_1, mockStore_1) {
    "use strict";
    describe('CleverComponent', function () {
        it('should show clicks', function () {
            // to test components we just manipulate the input streams
            var store = mockStore_1.mockStore({ clicks: { clicks: 5 } });
            var component$ = component_1.CleverComponent({ sinks: { store: store } });
            // then we render the result of the hyperscript stream and check the dom result
            var elem = virtual_dom_1.create(component$(), null);
            chai_1.expect(elem.innerText).to.contain('5');
        });
    });
});
//# sourceMappingURL=component.spec.js.map