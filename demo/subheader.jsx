import { zx } from "../src";

export const Subheader = ({ title, subtitle, id }) => zx`
  <div class="row center">
    <div class="anchor" id=${id}></div>
    <h3 class="light header highlight">${title}</h3>
    <p class="col s12 m8 offset-m2 caption">${subtitle}</p>
  </div>
`;
