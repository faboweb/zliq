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

            var start = Math.floor(scrollTop / childHeight);
            var count = Math.floor(containerHeight / childHeight);

            let {start: oldStart, count: oldCount} = renderConfig$.value;
            if (oldStart == null || oldCount < count || Math.abs(oldStart - start) > oldCount / 2) {
                return {
                    start,
                    count,
                    height: containerHeight
                };    
            }

            return {
                start: oldStart,
                count: oldCount,
                height: containerHeight
            };
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
        list$
    ).map(render);

    let oldList = [];
    function render([{
        start,
        count
    }, newList]) {
        if (newList == null || count == null) return;

        start = start - count;
        start = start < 0 ? 0 : start;
        var end = start + count + count;
        end = end > newList.length ? newList.length : end;

        let newChildren = [];
        for (let i = start; i < end; i++) {
            let actualIndex = i + start;
            // if values are equal just take the existing elem
            if (deepEqual(oldList[actualIndex], newList[actualIndex]) && allRenderedChildren[actualIndex] != null) {
                newChildren.push(allRenderedChildren[actualIndex]);
            } else {
                // if new data, render new list item
                let child = template(newList[actualIndex]);
                allRenderedChildren[actualIndex] = child;
                newChildren.push(child);
            }
        }
        children$(newChildren);
        oldList = newList;
    }

    // render list content
    let wrapElems$ = merge$(
            renderConfig$.$(['start','height']).distinct(),
            childHeight$,
            listLength$
        )
        .map(([[start, count], childHeight, childCount]) => {
            return [
                <div style={
                    { height: start * childHeight + 'px' }
                }></div>,
                <div style={
                    { height: (childCount - start - count) * childHeight + 'px' }
                }></div>
            ];
        });
    merge$(wrapElems$, children$)
        .map(([[top, bottom], children]) => [].concat(top, ...children, bottom))
        .map(containerChildren$);

    return container;
}