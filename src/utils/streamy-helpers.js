import { stream, merge$ } from './';

// wrapper around promises to provide an indicator if the promise is running
export const promise$ = (promise) => {
	let output$ = stream({
		loading: true,
		error: null,
		data: null
	});

	promise.then(result => {
		output$.patch({
			loading: false,
			data: result
		});
	}, error => {
		output$.patch({
			loading: false,
			error
		});
	});

	return output$;
}

// provide easy switched on boolean streams
// example use case: <button onclick={()=>open$(!open$())}>{if$(open$, 'Close', 'Open')}</button>
export function if$(boolean$, onTrue, onFalse) {
	if (boolean$ === undefined || typeof boolean$ === 'boolean') {
		return stream(boolean$ ? (onTrue||null) : (onFalse||null));
	}
    return boolean$.map(x=>x?(onTrue||null):(onFalse||null));
}

// join a mixed array of strings and streams of strings
// example use case: <div class={join$('container', if$(open$, 'open', 'closed'))} />
export function join$(...arr) {
    let $arr = arr.map(item => {
        if (item === null || item === undefined) {
            return stream('');
        }
        if (item.IS_STREAM) {
            return item;
        }
        return stream(item);
    });
    return merge$($arr).map(arr => arr.join(' '));
}