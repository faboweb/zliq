import { h, Router, UPDATE_DONE, stream } from "../src";
import { pug } from "../src/utils/zliq-pug";

export const Subheader = ({ title, subtitle, id }) => pug`
  .row.center
    .anchor(id= id)
    .light.header.highlight #{title}
    .col.s12.m8.offset.caption #{subtitle}
`;
