import "./content.css";
import CommentButtons from "./content/dom-modifiers/comment";

const comments = new CommentButtons();

document.addEventListener("focusin", function (event: FocusEvent) {
  if (event.target.classList.contains("ql-editor")) {
    comments.add_comments_button(event);
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "generate-comment-response":
      comments.write_comment(request.comment);
      break;
    case "redirect":
      window.location.href = request.redirect_url;
      break;
    default:
      console.log("unknown request type", request.type);
  }
});
