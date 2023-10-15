import React from "react";
import ReactDOM from "react-dom/client";
import AccountCard from "./AccountCard";

export default function attachComponent(parentForm: Element) {
  const root = document.createElement("div");
  root.id = "crx-root";
  parentForm.classList.add("crx-root");
  parentForm.appendChild(root);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <AccountCard />
    </React.StrictMode>
  );
}
