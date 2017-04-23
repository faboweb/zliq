import { h, easyFetch, Router, UPDATE_DONE, stream } from '../src';

export const Subheader = ({title, subtitle}) =>
    <div class="row center">
        <h3 class="light header highlight">{title}</h3>
        <p class="col s12 m8 offset-m2 caption">{subtitle}</p>
    </div>
;