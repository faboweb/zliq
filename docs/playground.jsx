import { zx } from "../src";
import { Subheader } from "./subheader.jsx";
import "./playground.scss";

export const Playground = () => zx`
  <div class="section">
    ${Subheader({
      title: "Experiment",
      subtitle: "Fork and get your hands dirty"
    })}
    <div isolated>
      <p *data-height="265" *data-theme-id="light" *data-slug-hash="XyeNQv" *data-default-tab="js,result" *data-user="faboweb" data-pen-title="ZLIQ Playground" class="codepen">See the Pen <a href="https://codepen.io/faboweb/pen/XyeNQv/">ZLIQ Playground</a> by Fabian Weber (<a href="https://codepen.io/faboweb">@faboweb</a>) on <a href="https://codepen.io">CodePen</a>.</p>
      <script async src="https://static.codepen.io/assets/embed/ei.js"></script>
    </div>
  </div>
`;
