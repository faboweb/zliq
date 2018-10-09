// dependencies
import "materialize-css/css/ghpages-materialize.css";

// core
import { render, h, stream, merge$ } from "../src";

// components
import { Subheader } from "./subheader.jsx";
import { Infos } from "./infos.jsx";
import { Header } from "./header.jsx";
import { Tutorial } from "./tutorial.jsx";
import { Playground } from "./playground.jsx";

//styles
import "./styles.scss";

//plugins
// import { shrinkStacktrace } from "zliq-stacktrace";
// let errorHandler = shrinkStacktrace(
//   /(src\/utils|bootstrap|null:null:null|bundle\.js)/
// );
// We can add the error handler whereever we catch an error
// Here we explicitly want the errors in ZLIQ for testing purposes
// window.onerror = (messageOrEvent, source, lineno, colno, error) =>
// 	errorHandler(error)

import { Router, initRouter } from "zliq-router";
let router$ = initRouter();

import signer from "signer";

// main render function for the application
// render provided hyperscript into a parent element
// zliq passes around HTMLElement elements so you can decide what to do with them
let app = () => {
  function createKey() {
    console.log(signer.createKey(document.querySelector(keyName)));
  }
  return (
    <div>
      <button onclick={() => createKey()}>Create Key</button>
      <input placeholder="keyName" id="keyName" />
    </div>
  );
};
render(app, document.querySelector("#app"), {
  config: {
    value: "abc",
    url: "www"
  }
});
