// dependencies
import 'materialize-css/css/ghpages-materialize.css'; 

// core
import { h, stream, merge$ } from '../src';

// redux
import { reduxy } from '../src';
import { clicks } from './reducers/clicks';

// router
import { routerReducer, initRouter, Router } from '../src';

// components
import { Navbar } from './navbar.jsx';
import { Infos } from './infos.jsx';
import { Examples } from './example.jsx';

// create the store providing reducers
let store = reduxy({
	clicks,
	router: routerReducer
});
initRouter(store);

// main render function for the application
// render provided hyperscript into a parent element
// zliq passes around HTMLElement elements so you can decide what to do with them
let app =
	<div>
		{/*<Navbar />*/}
		<Router store={store} route={'/'}>
			<Infos />
			<div class="divider"></div>
			<Examples store={store} />
		</Router>
	</div>;
document.querySelector('#app').appendChild(app);