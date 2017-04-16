import { h } from '../src/utils/streamy-hyperscript';

export function Infos() {
    return <div class="section">
        <div class="row">
            <h3 class="col s12 light center header red-text text-lighten-1">
                ZLIQ is the web-framework-force you would want your Padawan to learn.
            </h3>
        </div>
        <div class="row">
            <div class="col s12 m4">
                <div class="center promo">
                    {/*<i class="material-icons">flash_on</i>*/}
                    <p class="promo-caption">Fiew concepts</p>
                    <p class="light center">
                        ZLIQ is mainly based on functions and streams. If you know React you already understand it. But it doesn't force you into how to build your components.
                        <br />Bend it to your will.
                    </p>
                </div>
            </div>

            <div class="col s12 m4">
                <div class="center promo">
                    {/*<i class="material-icons">group</i>*/}
                    <p class="promo-caption">Based on streams</p>
                    <p class="light center">
                        ZLIQ uses streams to apply changes to the DOM. You can provide these streams per component. Or you can use the provided Redux implementation, for a centralised state management.
                        <br />Feel the flow.	
                    </p>
                </div>
            </div>

            <div class="col s12 m4">
                <div class="center promo">
                    {/*<i class="material-icons">settings</i>*/}
                    <p class="promo-caption">An evenings read</p>
                    <p class="light center">
                        ZLIQ has only a few lines of code (~680 April 2017 incl. comments). ZLIQ will be the first framework you actually understand E2E.
                        <br />Own your code.
                    </p>
                </div>
            </div>
        </div>
    </div>
}