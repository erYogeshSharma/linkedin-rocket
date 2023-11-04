import browser from "webextension-polyfill";
import MessageType from "../shared/constants/message-types";
import Auth from "./modules/auth";
import CommentBackground from "./modules/comment";
import logger from "../shared/utils/logger";
import PromptService from "./modules/prompt";
import SubscriptionService from "./modules/subscription";

const auth = new Auth();
const comments = new CommentBackground();
const prompts = new PromptService();
const subscription = new SubscriptionService();

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
    //COMMENT
    case MessageType.GET_COMMENT:
      comments.processGenerateCommentRequest(msg, response);
      break;
    //PROMPT
    case MessageType.GET_PROMPTS:
      prompts.get_prompts(msg, response);
      break;
    case MessageType.SAVE_PROMPT:
      prompts.save_prompt(msg, response);
      break;
    case MessageType.UPDATE_PROMPT:
      prompts.update_prompt(msg, response);
      break;
    case MessageType.DELETE_PROMPT:
      prompts.delete_prompt(msg, response);
      break;
    case MessageType.SEND_FEEDBACK:
      prompts.send_feedback(msg, response);
      break;
    case MessageType.DISABLE_DEFAULT_PROMPT:
      prompts.update_default_prompts(msg, response);
      break;
    //SUBSCRIPTIONS
    case MessageType.GET_PLANS:
      subscription.get_plans(msg, response);
      break;
    case MessageType.GET_SUBSCRIPTION_URL:
      subscription.get_payment_url(msg, response);
      break;
    case MessageType.CONFIRM_PAYMENT:
      subscription.confirm_payment_status(msg, response);
      break;
    default:
      break;
  }
  return true;
});
