import "./content.css";
import CommentButtons from "./content/dom-modifiers/comment";
import MessageType from "./shared/constants/message-types";

const comments = new CommentButtons();
comments.init();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.type) {
    case "generate-comment-response":
      comments.write_comment(request.comment);
      break;
    case MessageType.REDIRECT_AUTH_URL:
      window.location.href = request.url;
      break;
    default:
      console.log("unknown request type", request.type);
  }
});
