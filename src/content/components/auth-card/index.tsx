import React from "react";
import ReactDOM from "react-dom/client";
import AccountCard from "./AccountCard";
import { ThemeProvider } from "@mui/material";
import theme from "../../../shared/utils/theme";

export default function attachComponent(parentForm: Element) {
  const root = document.createElement("div");
  root.id = "crx-root";
  parentForm.classList.add("crx-root");
  parentForm.classList.add("rkt_account_card_attached");
  parentForm.insertBefore(root, parentForm.firstChild);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <AccountCard />
      </ThemeProvider>
    </React.StrictMode>
  );
}
