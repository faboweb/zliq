import Prism from 'prismjs';
import 'prismjs/components/prism-jsx.js';
import 'prismjs/themes/prism-solarizedlight.css';
import { h } from '../src';

export const Markup = (props, children) => {
    let code = children[0];
    let strippedMarginCode = code
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.trim().substr(1))
        .join('\n');
    let html = Prism.highlight(strippedMarginCode, Prism.languages.jsx);
    let elem = document.createElement('code');
    elem.classList.add('language-jsx')
    elem.innerHTML = html;
    return <pre class="language-jsx">
        {elem}
    </pre>;
};

export const Output = (props, children) => {
    return <pre class="example-output">
        {children}
    </pre>;
}