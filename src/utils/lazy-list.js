import deepEqual from 'deep-equal';
import {merge$, stream} from './streamy';
import {UPDATE_DONE} from './streamy-dom';
import {h} from './streamy-hyperscript';

let DEFAULT_CHILD_HEIGHT = 30;
let DEFAULT_ELEM_PADDING = 6;

export function LazyList(props) {
    let {store, list$, template, className, height, childHeight} = props;
    let children$ = stream([]);
    let renderBounds$ = stream({
        start: 0,
        end: 0,
        visibleChildren: 0
    });
    let containerChildren$ = stream([]);
    let debouncedScrollTop$ = stream(0);
    let repaint$ = stream(true);

    let container = <lazy-list
        style={{
            height: height + 'px',
            'overflow-y': 'auto',
            display: 'block' 
        }}>
            {containerChildren$}
        </lazy-list>;
        
    function getElementHeight(element) {
        return element.getBoundingClientRect().bottom - element.getBoundingClientRect().top;
    }

    let childHeight$ = children$
        .filter(children => children.length > 0)
        .flatMap(children => {
            let output$ = stream(childHeight || DEFAULT_CHILD_HEIGHT);
            
            if (children != null && children.length > 0) {
                children[0].addEventListener(UPDATE_DONE, () => {
                    let height = getElementHeight(children[0]);
                    height = Math.round(height * 100) / 100;
                    output$(height);
                });
            }

            return output$;
        }).distinct();
    let containerScrollTop$ = stream();
    function onScroll(e) {
        if (repaint$.value) return;
        let scrollTop = container.scrollTop;
        scrollTop = Math.floor(scrollTop / 10) * 10;
        containerScrollTop$(scrollTop);
    }
    container.addEventListener('scroll', onScroll);
    
    // let scrollContainer$ = scrollIncontainer$
    //     .reduce((scrollParent, scrollInContainer) => {
    //         if (scrollParent) {
    //             scrollParent.removeEventListener('scroll', onScroll);
    //         }
    //         scrollParent = scrollInContainer ? container : window;
    //         scrollParent.addEventListener('scroll', onScroll);

    //         return scrollParent;
    //     }, null);
    merge$(childHeight$.distinct(), containerScrollTop$.distinct(), renderBounds$.distinct())
        .map(([childHeight, scrollTop, {start, end, visibleChildren}]) => {
            let firstVisibleChild = Math.floor(scrollTop / childHeight);
            let lastVisibleChild = firstVisibleChild + visibleChildren;
            return end == 0 
                || firstVisibleChild <= start -1
                || lastVisibleChild >= end -1;
        })
        .map(repaint$);
    let listLength$ = list$.map(children => children.length || 0).distinct();
        
    // calc render config
    let currentRenderBounds$ = merge$(childHeight$, listLength$, containerScrollTop$.distinct())
        .map(([childHeight, childrenCount, scrollTop]) => {
            let visibleSpace = getElementHeight(container);
            let visibleChildren = Math.floor(visibleSpace / childHeight);
            let newStart = Math.floor((scrollTop || 0) / childHeight);
            // we render some elements on top and bottom to smooth the scrolling
            let paddedNewStart = newStart - DEFAULT_ELEM_PADDING;
            paddedNewStart = paddedNewStart > 0 ? paddedNewStart : 0;
            let newEnd = newStart + visibleChildren;
            let paddedNewEnd = newEnd + DEFAULT_ELEM_PADDING;
            paddedNewEnd = paddedNewEnd > childrenCount ? childrenCount : paddedNewEnd;

            return {
                start: paddedNewStart,
                visibleChildren,
                end: paddedNewEnd
            };
        })
        .distinct();
    merge$(currentRenderBounds$, repaint$)
        .map(([currentRenderBounds, repaint]) => {
            if (!repaint) return;
            renderBounds$(currentRenderBounds);
            repaint$(false);
        });
        // .filter(({ start, visibleChildren, end }) => {
        //     let {start: oldStart, end: oldEnd, visibleChildren: oldCount} = renderBounds$.value;
        //     return (oldStart == 0 && oldEnd == 0) // initial 
        //         || Math.abs(oldCount - visibleChildren) > 2 
        //         || (
        //             Math.abs(oldStart - start) > DEFAULT_ELEM_PADDING - 2
        //             && Math.abs(oldEnd - end) > DEFAULT_ELEM_PADDING - 2
        //         );
        // })
        // .map(renderBounds$);
        // .reduce((renderBounds$, { start, visibleChildren, end }) => {
        //     let {start: oldStart, end: oldEnd, visibleChildren: oldCount} = renderBounds$.value;
        //     // if (oldStart == null 
        //     //     || Math.abs(oldCount - visibleChildren) > 2 
        //     //     || (
        //     //         Math.abs(oldStart - start) > DEFAULT_ELEM_PADDING - 5
        //     //         && Math.abs(oldEnd - end) > DEFAULT_ELEM_PADDING - 5
        //     //     )) {
        //     //         renderBounds$({
        //     //             start,
        //     //             visibleChildren,
        //     //             end
        //     //         });    
        //     // }
        //     renderBounds$({
        //         start,
        //         visibleChildren,
        //         end
        //     }); 

        //     return renderBounds$;
        // }, renderBounds$);

    let renderedListPart$ = merge$(
        renderBounds$,
        list$
    ). map(([{
            start,
            end
        }, newList]) => {
            return newList.slice(start, end);
        });
    let renderedListPartLength$ = renderedListPart$.map(list => list.length).distinct();
    renderedListPartLength$.map(length => {
        let children = [];
        for (let i = 0; i < length; i++) {
            // if new data, render new list item
            let item$ = renderedListPart$.map(list => list[i]);
            let child = template(item$, childHeight$.map(height => height + 'px'));
            children.push(child);
        }
        return children;
    }).map(children$);

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
        .map(containerChildren$)

    return container;
}