import { h, stream, merge$ } from '../src';
import { Subheader } from './subheader.jsx';
import './playground.scss';

export const Playground = () =>
    <div class="section">
        <Subheader title="Experiment" subtitle="Fork and get your hands dirty" />
        <div isolated>
            <script async src="//jsfiddle.net/hvbee8m9/9/embed/js,result/"></script>
        </div>
    </div>;