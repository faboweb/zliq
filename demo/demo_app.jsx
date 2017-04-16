import { h } from '../src/utils/streamy-hyperscript';
import { stream, merge$} from '../src/utils/streamy';

// redux
import { reduxy } from '../src/utils/reduxy';
import { clicks } from './reducers/clicks';

// router
import { routerReducer, initRouter, Router } from '../src/reducers/router';

// components
import { Navbar } from './navbar.jsx';
import { Infos } from './infos.jsx';
import { Example } from './example.jsx';

//styles
import 'materialize-css/css/ghpages-materialize.css';

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
		<Navbar />
		<Router store={store} route={'/'}>
			<Infos />
			<div class="divider"></div>
			<Example store={store} />
		</Router>
	</div>;
document.querySelector('#app').appendChild(app);