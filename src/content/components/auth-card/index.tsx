import React from "react";
import ReactDOM from "react-dom/client";
import AccountCard from "./AccountCard";

export default function attachComponent(parentForm: Element) {
  const root = document.createElement("div");
  root.id = "crx-root";
  parentForm.classList.add("crx-root");
  parentForm.classList.add("rkt_account_card_attached");
  parentForm.insertBefore(root, parentForm.firstChild);
  console.log("here");
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AccountCard />
    </React.StrictMode>
  );
}
