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
      <script async src="//jsfiddle.net/hvbee8m9/10/embed/js,result/" />
    </div>
  </div>
`;
