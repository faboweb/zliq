import deepEqual from 'deep-equal';
import {merge$, stream} from './streamy';
import {UPDATE_EVENT} from './streamy-dom';
import {h} from './streamy-hyperscript';

let DEFAULT_CHILD_HEIGHT = 30;
let DEFAULT_ELEM_PADDING = 30;

export function LazyList(props) {
    let {store, list$, template, className, height, maxHeight} = props;
    let children$ = stream([]);
    let renderBounds$ = stream({
        start: 0,
        end: 0,
        visibleChildren: 0
    });
    let containerChildren$ = stream([]);
    let containerHeight$ = stream(0);
    let containerHeightStyle$ = chooseContainerHeightStyle(height, maxHeight, containerHeight$);
    let scrollTop$ = stream(0);

    function chooseContainerHeightStyle(height, maxHeight, containerHeight$) {
        if (height) {
            return stream(height);
        } else if (maxHeight) {
            return containerHeight$
            .map(height => maxHeight && height > maxHeight ? maxHeight + 'px' : 'auto');
        } else {
            return stream('auto');
        }
    };

    let container = <lazy-list
        style={{
            height: containerHeightStyle$,
            'overflow-y': 'auto',
            display: 'block' 
        }}>
            {containerChildren$}
        </lazy-list>;

    // react to scrolling
    let scrollIncontainer$ = merge$(children$, containerHeight$)
        .filter(([_, height]) => height !== 'auto')
        .distinct();
    scrollIncontainer$
        .reduce((scrollParent, scrollInContainer) => {
            function onScroll(e) {
                let scrollTop = scrollParent.scrollTop || scrollParent.scrollY;
                scrollTop = Math.round(scrollTop * 100) / 100;
                scrollTop$(scrollTop);
            }
            if (scrollParent) {
                scrollParent.removeEventListener('scroll', onScroll);
            }
            scrollParent = scrollInContainer ? container : window;
            scrollParent.addEventListener('scroll', onScroll);

            return scrollParent;
        }, null);
        
    function getElementHeight(element) {
        return element.getBoundingClientRect().bottom - element.getBoundingClientRect().top;
    }

    let childHeight$ = children$
        .filter(children => children.length > 0)
        .flatMap(children => {
            let output$ = stream(DEFAULT_CHILD_HEIGHT);
            
            if (children != null && children.length > 0) {
                children[0].addEventListener(UPDATE_EVENT.DONE, () => {
                    let height = getElementHeight(children[0]);
                    height = Math.round(height * 100) / 100;
                    output$(height);
                });
            }

            return output$;
        }).distinct();
    let listLength$ = list$.map(children => children.length || 0).distinct();

    // calculate the height of the container
    merge$(childHeight$, listLength$, scrollTop$)
        .map(([childHeight, childrenCount, scrollTop]) => {
            let offset = container.getBoundingClientRect().top;
            let windowHeight = window.innerHeight;
            let fullHeight = childrenCount * childHeight;
            if (height && fullHeight > height) {
                return height;
            } else if(maxHeight && fullHeight > maxHeight) {
                return maxHeight;
            } else if (fullHeight > windowHeight - offset) {
                return windowHeight - offset;
            }
        })
        .distinct()
        .map(containerHeight$);
        
    // calc render config
    merge$(childHeight$, listLength$, scrollTop$)
        .map(([childHeight, childrenCount, scrollTop]) => {
            let visibleSpace = getElementHeight(container);
            let visibleChildren = Math.floor(visibleSpace / childHeight);
            // we render the some amount of children to the top and bottom to scroll smoother
            let start = Math.floor(scrollTop / childHeight) - DEFAULT_ELEM_PADDING;
            start = start > 0 ? start : 0;
            let end = start + visibleChildren + DEFAULT_ELEM_PADDING * 2;
            end = end > childrenCount ? childrenCount : end;

            return {
                start,
                visibleChildren,
                end
            };
        })
        .reduce((renderBounds$, { start, visibleChildren, end }) => {
            let {start: oldStart, visibleChildren: oldCount} = renderBounds$.value;
            if (oldStart == null 
                || Math.abs(oldCount - visibleChildren) > oldCount / 2 
                || Math.abs(oldStart - start) > DEFAULT_ELEM_PADDING - 5) {
                    renderBounds$({
                        start,
                        visibleChildren,
                        end
                    });    
            }

            return renderBounds$;
        }, renderBounds$);

    let allRenderedChildren = [];
    merge$(
        renderBounds$,
        list$,
        childHeight$
    ).reduce(render, []);

    function render(oldList, [{
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
            renderBounds$.distinct(),
            childHeight$.distinct(),
            listLength$
        )
        .map(([{start, end}, childHeight, childCount]) => {
            // the size of the container will be extended to show a scrollbar that immitates a filled list
            let topRows = start;
            let bottomRows = childCount - end;
            return [
                <div style={{ height: topRows * childHeight + 'px' }}></div>,
                <div style={{ height: bottomRows * childHeight + 'px' }}></div>
            ];
        });
    merge$(wrapElems$, children$)
        .map(([[top, bottom], children]) => [].concat(top, ...children, bottom))
        .map(containerChildren$);

    return container;
}