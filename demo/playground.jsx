import { h, stream, merge$ } from '../src';
import { Subheader } from './subheader.jsx';
import './playground.scss';

export const Playground = () =>
    <div class="section">
        <Subheader title="Experiment" subtitle="Get your hands dirty" />
        <script async src="//jsfiddle.net/faboweb/hvbee8m9/embed/js,html,result/"></script>
    </div>;