import {BST} from './binary-tree';

export class PST {
    constructor() {
        this.tree = new BST();
    }

    add(index) {
        let node = this.tree.insert(index, {
            before: 0,
            after: 0,
        });
        node.before = node.left ? node.left.before + node.left.after : 0;
        node.after = node.right ? node.right.before + node.right.after : 0;
        this.tree.bubbleUp(node, (parent, childIndex) => {
            if (parent.left && parent.left.index === childIndex) {
                parent.before = parent.left.before + parent.left.after;
            } else {
                parent.after = parent.right.before + parent.right.after;
            }
        });
    }

    getBefore(index) {
        let node = this.tree.search(index);
        if ()
    }
}