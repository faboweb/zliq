import { h } from "../src";
import { pug } from "../src/utils/zliq-pug";

let InfoBullet = ({ icon, title }, children) => pug`
  .col.s12.m4
    .center.promo
      i.material-icons.highlight #{icon}
      p.promo-caption.highlight-less #{title}
      p.light.center
        children
`;

export const Infos = () => pug({ InfoBullet })`
  .section
    .row
      InfoBullet(icon="fast_forward" title="Few Concepts")
        | ZLIQ is mainly based on functions and streams. If you know React you
        | already understand it. But it doesn't force you into how to build your
        | components.
        br
        | Bend it to your will.
      InfoBullet(icon="merge_type" title="Based on streams")
        | ZLIQ uses streams to apply changes to the DOM. You can provide these
        | streams per component. Or you can provide a state stream and pass it
        | through to your component.
        br
        | Feel the flow.
      InfoBullet(icon="short_text" title="An evenings read")
        | ZLIQ has only a few lines of code (~600 January 2018). ZLIQ may be the
        | first framework you actually understand E2E.
        br
        | Own your code.
`;
