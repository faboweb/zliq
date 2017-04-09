import deepEqual from 'deep-equal';
import {merge$, stream} from './streamy';
import {UPDATE_EVENT} from './streamy-dom';
import {h} from './streamy-hyperscript';

let DEFAULT_CHILD_HEIGHT = 30;

export function LazyList(props) {
    let {store, list$, template, className, maxHeight} = props;
    maxHeight = maxHeight || 500;
    let children$ = stream([]);
    let renderConfig$ = stream([]);
    let containerChildren$ = stream([]);
    let container = <lazy-list
        style={{
            height: renderConfig$.$('height').map(height => height + 'px'),
            overflowY: 'auto',
            display: 'block' 
        }}>
            {containerChildren$}
        </lazy-list>;
    let scrollEvent$ = stream(null);
    container.addEventListener('scroll', scrollEvent$);
    let childHeight$ = stream(DEFAULT_CHILD_HEIGHT);
    children$
        .filter(children => children.length > 0)
        .map(children => {
            if (children == null || children.length == 0) return;
            
            children[0].addEventListener(UPDATE_EVENT.DONE, () => {
                let height = getElementHeight(children[0]);
                height = Math.round(height * 100) / 100;
                childHeight$(height);
            });
        });
    let listLength$ = list$.map(children => children.length || 0).distinct();
    merge$(childHeight$.distinct(), listLength$, scrollEvent$)
        .map(([childHeight, childrenCount, scrollEvent]) => {
            childHeight = childHeight || DEFAULT_CHILD_HEIGHT;
            var scrollTop = container.scrollTop;
            let offset = container.getBoundingClientRect().top;
            let windowHeight = window.innerHeight;
            let containerHeight = getHeight(childrenCount, childHeight, maxHeight || windowHeight - offset);

            let count = Math.floor(containerHeight / childHeight);
            let start = Math.floor(scrollTop / childHeight) - count;
            start = start > 0 ? start : 0;
            let end = start + count * 2;
            end = end > childrenCount ? childrenCount : end;

            let {start: oldStart, count: oldCount} = renderConfig$.value;
            if (oldStart == null 
                || Math.abs(oldCount - count) > oldCount / 2 
                || Math.abs(oldStart - start) > oldCount / 2) {
                    return {
                        start,
                        count,
                        end,
                        height: containerHeight
                    };    
            }

            return Object.assign({}, renderConfig$.value, {
                height: containerHeight
            });
        })
        .map(renderConfig$);
    function getHeight(numChildren, childHeight, maxHeight) {
        var fullHeight = numChildren * childHeight;
        if (maxHeight && fullHeight > maxHeight) {
            return maxHeight;
        } else {
            return fullHeight;
        }
    }
    function getElementHeight(element) {
        return element.getBoundingClientRect().bottom - element.getBoundingClientRect().top;
    }

    let allRenderedChildren = [];
    merge$(
        renderConfig$,
        list$,
        childHeight$
    ).map(render);

    let oldList = [];
    function render([{
        start,
        end
    }, newList, childHeight]) {
        if (newList == null) return;

        let newChildren = [];
        for (let i = start; i < end && i < newList.length; i++) {
            if (deepEqual(oldList[i], newList[i]) && allRenderedChildren[i] != null) {
                newChildren.push(allRenderedChildren[i]);
            } else {
                // if new data, render new list item
                let child = template(newList[i]);
                child.style.height = childHeight + 'px';

                allRenderedChildren[i] = child;
                newChildren.push(child);
            }
        }
        children$(newChildren);
        oldList = newList;
    }

    // render list content
    let wrapElems$ = merge$(
            renderConfig$.$(['start','end']).distinct(),
            childHeight$.distinct(),
            listLength$
        )
        .map(([[start, end], childHeight, childCount]) => {
            // the size of the container will be extended to show a scrollbar that immitates a filled list
            let topRows = start;
            let bottomRows = childCount - end;
            return [
                <div style={
                    { height: topRows * childHeight + 'px' }
                }></div>,
                <div style={
                    { height: bottomRows * childHeight + 'px' }
                }></div>
            ];
        });
    merge$(wrapElems$, children$)
        .map(([[top, bottom], children]) => [].concat(top, ...children, bottom))
        .map(containerChildren$);

    return container;
}