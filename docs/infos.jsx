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
        { icon: "photo_size_select_small", title: "Plug and play" },
        zx`
        ZLIQ is build to be plug and play. You don't need to preprocess your files 
        via webpack er similar tools. This keeps your stack small and easy to work with.
        <br />Simple is good.
      `
      )}
    </div>
  </div>
`;
