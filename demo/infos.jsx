import { h } from '../src';
import './infos.scss';

export const Infos = () => [
    <div class="section">
        <div class="row">
            <div class="col s12 m4">
                <div class="center promo">
                    <i class="material-icons highlight">fast_forward</i>
                    <p class="promo-caption highlight-less">Few concepts</p>
                    <p class="light center">
                        ZLIQ is mainly based on functions and streams. If you know React you already understand it. But it doesn't force you into how to build your components.
                        <br />Bend it to your will.
                    </p>
                </div>
            </div>

            <div class="col s12 m4">
                <div class="center promo">
                    <i class="material-icons highlight">merge_type</i>
                    <p class="promo-caption highlight-less">Based on streams</p>
                    <p class="light center">
                        ZLIQ uses streams to apply changes to the DOM. You can provide these streams per component. Or you can use the provided Redux implementation, for a centralised state management.
                        <br />Feel the flow.	
                    </p>
                </div>
            </div>

            <div class="col s12 m4">
                <div class="center promo">
                    <i class="material-icons highlight">short_text</i>
                    <p class="promo-caption highlight-less">An evenings read</p>
                    <p class="light center">
                        ZLIQ has only a few lines of code (~680 April 2017 incl. comments). ZLIQ will be the first framework you actually understand E2E.
                        <br />Own your code.
                    </p>
                </div>
            </div>
        </div>
    </div>
];