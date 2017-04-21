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
import { Infos } from './infos.jsx';
import { Examples } from './example.jsx';

//styles
import './styles.scss';

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
		<a href="https://github.com/faboweb/zliq"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" /></a>
		<Router store={store} route={'/'}>
			<Infos />
			<div class="divider"></div>
			<Examples store={store} />
		</Router>
	</div>;
document.querySelector('#app').appendChild(app);