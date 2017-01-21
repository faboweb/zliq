import flyd from 'flyd';

export const deepSelect = (input$, selector) => {
	let selectors = selector.split('.');

	return selectors.reduce((curr$, selector) => {
		return curr$.map((input) => {
			return input[selector];
		});
	}, input$);
};