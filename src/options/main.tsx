import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./App";
import "./index.css";
// import { ThemeProvider } from "@mui/material/styles";
// import theme from "../shared/utils/theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* <ThemeProvider theme={theme}> */}
    <Popup />
    {/* </ThemeProvider> */}
  </React.StrictMode>
);
