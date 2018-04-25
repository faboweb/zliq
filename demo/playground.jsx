import { h, stream, merge$ } from "../src";
import { pug } from "../src/utils/zliq-pug";
import { Subheader } from "./subheader.jsx";
import "./playground.scss";

export const Playground = () => pug({ Subheader })`
  .section
    Subheader(
      title="Experiment"
      subtitle="Fork and get your hands dirty"
      id="experiment"
    )
    div(isolated)
      script(async src="//jsfiddle.net/hvbee8m9/10/embed/js,result/")
`;
