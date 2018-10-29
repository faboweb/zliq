export * from "./streamy";
export * from "./render";
export * from "./streamy-vdom";
export * from "./streamy-helpers";

import hyperx from "./hyperx";
import { h } from "./streamy-vdom";
export const zx = hyperx(h);
