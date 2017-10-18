// dependencies
import 'materialize-css/css/ghpages-materialize.css';

// core
import { render, h, stream, merge$ } from '../src';

// components
import { Subheader } from './subheader.jsx';
import { Infos } from './infos.jsx';
import { Header } from './header.jsx';
import { Tutorial } from './tutorial.jsx';
import { Playground } from './playground.jsx';

//styles
import './styles.scss';

// main render function for the application
// render provided hyperscript into a parent element
// zliq passes around HTMLElement elements so you can decide what to do with them
let app = <div>
	<Header />
	<div class="container">
		<a href="https://github.com/faboweb/zliq"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png" /></a>
		<Infos />
		<div class='section'>
					<Subheader title="Motivation" subtitle="Why yet another web framework?" id="motivation"/>

			<div class="row">
				<p>Modern web frameworks got really big (React + Redux 139Kb and Angular 2 + Rx 766Kb, <a href="https://gist.github.com/Restuta/cda69e50a853aa64912d">src</a>). As a developer I came into the (un)pleasant situation to teach people how these work. But I couldn't really say, as I haven't actually understood each line of code in these beasts. But not only that, they also have a lot of structures I as a developer have to learn to get where I want to go. It feels like learning programming again just to be able to render some data.</p>
				<p>ZLIQ tries to be something simple. Something that reads in an evening. But that is still so powerful you can just go and display complex UIs with it. Something that feels more JS less Java.</p>
				<p>Still ZLIQ doesn't try to be the next React or Angular! ZLIQ has a decent render speed even up to several hundred simultaneous updates but it's not as fast as <a href="(https://preactjs.com/">Preact</a>. And it on purpose does not solve every problem you will ever have. ZLIQ is a tool to help you create the solution that fits your need.</p>
			</div>
		</div>
		<Tutorial/>
		<Playground />
	</div>
</div>;
render(app, document.querySelector('#app'));
