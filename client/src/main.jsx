import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BlockchainProvider } from "./context/Context";

ReactDOM.render(
  <BlockchainProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BlockchainProvider>,
  document.getElementById("root")
);
