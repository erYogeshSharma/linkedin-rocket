import React from "react";
import ReactDOM from "react-dom/client";
import CommentButton from "./CommentButton";

export default function attachComponent(parentForm: Element) {
  const root = document.createElement("div");
  root.id = "crx-root";
  parentForm.classList.add("crx-root");
  parentForm.appendChild(root);

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <CommentButton />
    </React.StrictMode>
  );
}
