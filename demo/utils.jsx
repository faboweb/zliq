import Prism from "prismjs";
import "prismjs/components/prism-jsx.js";
import "prismjs/themes/prism-solarizedlight.css";
import { zx, stream } from "../src";

export const Markup = code => {
  let code$ = stream("");
  // need to timeout here until prism is initialized
  setTimeout(() => {
    let strippedMarginCode = code
      .split("\n")
      .filter(line => line.trim() !== "")
      .map(line => line.trim().substr(1))
      .join("\n");
    let html = Prism.highlight(strippedMarginCode, Prism.languages.jsx);
    code$(html);
  }, 10);
  return zx`
    <pre class="language-jsx"><code class="language-jsx" innerHTML=${code$}></code></pre>
  `;
};

export const Output = children => zx`
  return <pre class="example-output">${children}</pre>;
`;
