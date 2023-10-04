import React from "react";
import ReactDOM from "react-dom/client";
import Button from "./Button";

export default function attachButton(parentForm: Element) {
  const root = document.createElement("div");
  root.id = "crx-root";
  parentForm.classList.add("crx-root");
  parentForm.appendChild(root);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Button />
    </React.StrictMode>
  );
}
