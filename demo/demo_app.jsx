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
import { Header } from './header.jsx';
import { Examples } from './example.jsx';
import { Tutorial } from './tutorial.jsx';

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
let app = <div>
	<Header />
	<div class="container">
		<a href="https://github.com/faboweb/zliq"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" /></a>
		<Router store={store} route={'/'}>
			<Infos />
			<div class='section'>
				<div class="row center">
					<h3 class="light header highlight">Motivation</h3>
					<p class="col s12 m8 offset-m2 caption">Why yet another web framework?</p>
				</div>
				<div class="row">
					<p>Modern web frameworks got really big (React + Redux 139Kb and Angular 2 + Rx 766Kb, <a href="https://gist.github.com/Restuta/cda69e50a853aa64912d">src</a>). As a developer I came into the (un)pleasent situation to teach people how these work. But I couldn't really say, as I haven't actually understood each line of code in these beasts. But not only that, they also have a lot of structures I as a developer have to learn to get where I want to go. It feels like learning programming again just to be able to render some data.</p>
					<p>ZLIQ tries to be sth simple. Sth that reads in an evening. But that is still so powerfull you can just go and display complex UIs with it. Sth that feels more JS less Java.</p>
				</div>
			</div>
			<Tutorial/>
			{/*<Examples store={store} />*/}
		</Router>
	</div>
</div>;
document.querySelector('#app').appendChild(app);