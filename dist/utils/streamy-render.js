define(["require", "exports", "virtual-dom/diff", "virtual-dom/patch", "virtual-dom/create-element"], function (require, exports, diff_1, patch_1, create_element_1) {
    "use strict";
    /*
    * render a virtual dom stream into a parent element
    */
    exports.render = function (tree$, parentElem) {
        var oldTree = tree$();
        var rootNode = create_element_1.default(oldTree);
        parentElem.appendChild(rootNode);
        // on updates of the virtual dom stream update the actual dom
        tree$.map(function (tree) {
            var patches = diff_1.default(oldTree, tree);
            patch_1.default(rootNode, patches);
            oldTree = tree;
        });
    };
});
//# sourceMappingURL=streamy-render.js.map