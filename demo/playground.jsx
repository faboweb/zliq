import { h, stream, merge$ } from '../src';
import { Subheader } from './subheader.jsx';
import './playground.scss';

export const Playground = () =>
    <div class="section">
        <Subheader title="Experiment" subtitle="Fork and get your hands dirty" />
        <script async src="//jsfiddle.net/hvbee8m9/3/embed/js,html,result/"></script>
    </div>;