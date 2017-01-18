import flyd from 'flyd';

export const deepSelect = (input$, selector) => {
	let selectors = selector.split('.');

	return flyd.map((input$) => {
		return selectors.reduce((obj, selector) => {
			return obj[selector];
		}, input$());
	}, [input$]);
};