import { h } from './utils/streamy-hyperscript';
import { list } from './utils/streamy-createElement';
import { stream, merge$} from './utils/streamy';
import { render } from './utils/streamy-render';

function _random(max) {
	return Math.round(Math.random()*1000)%max;
};
 
let adjectives = ['pretty', 'large', 'big', 'small', 'tall', 'short', 'long', 'handsome', 'plain', 'quaint', 'clean', 'elegant', 'easy', 'angry', 'crazy', 'helpful', 'mushy', 'odd', 'unsightly', 'adorable', 'important', 'inexpensive', 'cheap', 'expensive', 'fancy'];
let colours = ['red', 'yellow', 'blue', 'green', 'pink', 'brown', 'purple', 'brown', 'white', 'black', 'orange'];
let nouns = ['table', 'chair', 'house', 'bbq', 'desk', 'car', 'pony', 'cookie', 'sandwich', 'burger', 'pizza', 'mouse', 'keyboard'];

let id = 1;
function buildData(count = 1000) {
	var data = [];
	
	for(var i = 0; i < count; i++) {
		data.push({
			id: id++,
			label: adjectives[_random(adjectives.length)] + ' ' + colours[_random(colours.length)] + ' ' + nouns[_random(nouns.length)]
		});
	}
	
	return data;
};

let state$ = stream({items:[]});

const Operations = {
	Run: () => state$({items: buildData(), selected: undefined}),
	Update: () => {
		let {items, selected} = state$();
		let updatedItems = items.map((item, idx) => (idx%10 === 0) 
			? ({id:item.id, label: item.label+' !!!'}) 
			: item);
		state$({items: updatedItems, selected});
	},
	Add: () => {
		let {items, selected} = state$();
		state$({items: items.concat(buildData(1000)), selected})
	},
	SelectItem: item => () => {
		let {items, selected} = state$();
		state$({items, selected: item})
	},
	RemoveItem: id => () => {
		let {items, selected} = state$();
		state$({items: items.filter(item => item.id !== id), selected})
	},
	RunLots: () => state$({items: buildData(10000), selected: null}),
	Clear: () => state$({items: [], selected: null}),
	SwapRows: () => {
		let {items, selected} = state$();
		let d = items.splice(0);
		if(d.length > 10) {
			var a = d[4];
			d[4] = d[9];
			d[9] = a;
		}
		state$({items: d, selected});
	}
};

function removeItem(evt) {
	evt.preventDefault();
	evt.stopPropagation();
	
	let el = evt.target;
	while(el && !el.id) {
		el = el.parentNode;
	}
	
	Operations.RemoveItem(parseInt(el.id))();
}

function selectItem(evt) {
	evt.preventDefault();
	evt.stopPropagation();
	
	let el = evt.target;
	while(el && !el.id) {
		el = el.parentNode;
	}
	
	Operations.SelectItem(parseInt(el.id))();
}

let app =
	<div className='container'>
		<div className='jumbotron'>
			<div className='row'>
				<div className='col-md-6'>
					<h1>ZLIQ</h1>
				</div>
				<div className="col-md-6">
					<div className="row">
						<div className="col-sm-6 smallpad">
							<button type='button' className='btn btn-primary btn-block' id='run'
								onclick={Operations.Run}>Create 1,000 rows</button>
						</div>
						<div className="col-sm-6 smallpad">
							<button type='button' className='btn btn-primary btn-block' id='runlots'
								onclick={Operations.RunLots}>Create 10,000 rows</button>
						</div>
						<div className="col-sm-6 smallpad">
							<button type='button' className='btn btn-primary btn-block' id='add'
								onclick={Operations.Add}>Append 1,000 rows</button>
						</div>
						<div className="col-sm-6 smallpad">
							<button type='button' className='btn btn-primary btn-block' id='update'
								onclick={Operations.Update}>Update every 10th row</button>
						</div>
						<div className="col-sm-6 smallpad">
							<button type='button' className='btn btn-primary btn-block' id='clear'
								onclick={Operations.Clear}>Clear</button>
						</div>
						<div className="col-sm-6 smallpad">
							<button type='button' className='btn btn-primary btn-block' id='swaprows'
								onclick={Operations.SwapRows}>Swap Rows</button>
						</div>
					</div>
				</div>
			</div>
		</div>
		<table className='table table-hover table-striped test-data'>
			<tbody>
			{
				list(state$, 'items', (item, {selected}) =>
					<tr id={item.id} className={selected === item.id ? 'danger' : ''}>
						<td className='col-md-1'>{item.id}</td>
						<td className='col-md-4'>
							<a className='select' onclick={selectItem}>{item.label}</a>
						</td>
						<td className='col-md-1'>
							<a className='remove' onclick={removeItem}><span className='glyphicon glyphicon-remove'></span></a>
						</td>
						<td className='col-md-6'/>
					</tr>
				)
			}
			</tbody>
		</table>
		<span className="preloadicon glyphicon glyphicon-remove" aria-hidden="true"></span>
	</div>
;
document.querySelector('#main').appendChild(app);