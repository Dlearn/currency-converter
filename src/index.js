import React from "react";
import ReactDOM from "react-dom";
import { Header } from "semantic-ui-react";

import App from "./components/App";

import "semantic-ui-css/semantic.min.css";

ReactDOM.render(
  <>
    <Header as="h1" style={{ padding: "48px 0" }} textAlign="center">
      Currency Converter
    </Header>
    <App />
  </>,
  document.getElementById("root"),
);
