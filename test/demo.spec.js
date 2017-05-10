import { h, stream, list, UPDATE_DONE } from '../src';

describe('Demo App', () => {
	it('should render the app', () => {
        let container = document.createElement('div');
        container.setAttribute('id', 'app');
        document.body.appendChild(container);
		require('../demo/demo_app.jsx');
	});
});
