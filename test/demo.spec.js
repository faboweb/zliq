import { h, stream, list, UPDATE_DONE } from '../src';

describe('Demo App', () => {
    // currently does not work with jsdom
	xit('should render the app', () => {
        let container = document.createElement('div');
        container.setAttribute('id', 'app');
        document.body.appendChild(container);
		require('../demo/demo_app.jsx');
	});
});
