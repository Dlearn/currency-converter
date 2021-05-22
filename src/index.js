import React from "react";
import ReactDOM from "react-dom";
import { Container, Header } from "semantic-ui-react";

import App from "./components/App";

import "semantic-ui-css/semantic.min.css";

ReactDOM.render(
  <Container style={{ padding: "48px 0" }}>
    <Header as="h1" textAlign="center">
      Currency Converter
    </Header>
    <App />
  </Container>,
  document.getElementById("root"),
);
