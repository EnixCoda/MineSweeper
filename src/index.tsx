import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./components/App";

ReactDOM.render(
  <ChakraProvider
    theme={extendTheme({
      fonts: { body: "system-ui" },
    })}
  >
    <App />
  </ChakraProvider>,
  document.querySelector("#app")
);
