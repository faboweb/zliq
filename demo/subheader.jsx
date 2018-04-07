import { h, Router, UPDATE_DONE, stream } from "../src";

export const Subheader = ({ title, subtitle, id }) => (
  <div class="row center">
    <div class="anchor" id={id} />
    <h3 class="light header highlight">{title}</h3>
    <p class="col s12 m8 offset-m2 caption">{subtitle}</p>
  </div>
);
