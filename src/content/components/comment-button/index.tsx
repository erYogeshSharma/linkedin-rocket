import React from "react";
import ReactDOM from "react-dom/client";
import CommentButton from "./CommentButton";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../shared/utils/theme";

export default function attachComponent(parentForm: Element) {
  const root = document.createElement("div");
  root.id = "crx-root";
  parentForm.classList.add("crx-root");
  parentForm.appendChild(root);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CommentButton />
      </ThemeProvider>
    </React.StrictMode>
  );
}
