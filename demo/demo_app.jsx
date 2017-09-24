// dependencies
import 'materialize-css/css/ghpages-materialize.css';

// core
import { render, h, stream, merge$ } from '../src';

// router
import { initRouter, Router } from '../src';

// components
import { Subheader } from './subheader.jsx';
import { Infos } from './infos.jsx';
import { Header } from './header.jsx';
import { Tutorial } from './tutorial.jsx';
import { Playground } from './playground.jsx';

//styles
import './styles.scss';

import {test} from '../test/helpers/test-component.js';

let content$ = stream('');
let app = <div>
	{content$}
	<div id="test"></div>
</div>;
let i;
test(app, [
	(element, {keyContainer}) => {
		// manipulating the dom to prove update
		element.replaceChild(document.createElement('div'), keyContainer['test'].element);
		// manipulating the stored element
		keyContainer['test'].element.setAttribute('id', 'updated');
		content$('text');
	},
	(element, {keyContainer}) => {
		expect(element.querySelector('#updated')).not.toBe(null);
	},
])
