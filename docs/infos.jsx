import { zx } from "../src";

let InfoBullet = ({ icon, title }, children) => zx`
  <div class="col s12 m4">
    <div class="center promo">
      <i class="material-icons highlight">${icon}</i>
      <p class="promo-caption highlight-less">${title}</p>
      <p class="light center">${children}</p>
    </div>
  </div>
`;

export const Infos = zx`
  <div class="section">
    <div class="row">
      ${InfoBullet(
        { icon: "fast_forward", title: "Few concepts" },
        zx`
        ZLIQ is mainly based on functions and streams. If you know React you
          already understand it. But it doesn't force you into how to build your
          components.
          <br />Bend it to your will.
      `
      )}

      ${InfoBullet(
        { icon: "merge_type", title: "Based on streams" },
        zx`
        ZLIQ uses streams to apply changes to the DOM. You can provide these
        streams per component. Or you can provide a state stream and pass it
        through to your component.
        <br />Feel the flow.
      `
      )}

      ${InfoBullet(
        { icon: "short_text", title: "An evenings read" },
        zx`
        ZLIQ has only a few lines of code (~600 January 2018). ZLIQ may be the
        first framework you actually understand E2E.
        <br />Own your code.
      `
      )}
    </div>
  </div>
`;