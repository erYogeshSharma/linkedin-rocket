import browser from "webextension-polyfill";
import MessageType from "../shared/constants/message-types";
import Auth from "./modules/auth";
import CommentBackground from "./modules/comment";
import logger from "../shared/utils/logger";

const auth = new Auth();
const comments = new CommentBackground();

browser.runtime.onMessage.addListener((msg, _, response) => {
  logger.info("Request Received For: ", msg.action);
  switch (msg.action) {
    case MessageType.START_AUTH:
      auth.start_auth(msg, response);
      break;
    case MessageType.REGISTER_TOKEN:
      auth.register_token(msg, response);
      break;
    case MessageType.RELOAD_CREDITS_LIMIT:
      comments.update_credits(msg, response);
      break;
    case MessageType.GET_COMMENT:
      comments.processGenerateCommentRequest(msg, response);
    default:
      break;
  }
  return true;
});
