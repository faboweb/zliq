import { h, stream } from '../src';
import './header.scss';

export const Header = () => {
    let scroll$ = stream();
    window.addEventListener('scroll', scroll$);

    let headerHidden$ = scroll$.map(() => {
        let scrollTop = window.scrollY;
        return scrollTop > 100;
    });

    return <div 
            class={headerHidden$.map(hidden => "row big-header highlight-background " + (hidden ? 'hidden' : ''))}
            onclick={scrollUp}
        >
            <div class="container">
                <div class="row">
                    <div class="col s12 center">
                        <img src="./icon.png" />
                    </div>
                    <h1 class="col s12 center highlight">ZLIQ</h1>
                </div>
                <h3 class="center highlight-less">The web-framework-force you want your Padawan to learn.</h3>
            </div>
        </div>;
} 

function scrollUp() {
    scrollTo(document.body, 0, 0.5);
}

function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}