import Prism from "prismjs";
import "prismjs/components/prism-jsx.js";
import "prismjs/themes/prism-solarizedlight.css";
import { h, stream } from "../src";

export const Markup = (props, children$) => {
  // children are always arrays of arrays to allow children that stream arrays
  let code$ = stream("");
  setTimeout(() => {
    children$
      .map(children => {
        let code = children[0];
        let strippedMarginCode = code
          .split("\n")
          .filter(line => line.trim() !== "")
          .map(line => line.trim().substr(1))
          .join("\n");
        let html = Prism.highlight(strippedMarginCode, Prism.languages.jsx);
        return html;
      })
      .map(code$);
  }, 10);
  return (
    <pre class="language-jsx">
      <code class="language-jsx" innerHTML={code$} />
    </pre>
  );
};

export const Output = (props, children) => {
  return <pre class="example-output">{children}</pre>;
};
