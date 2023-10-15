import MessageType from "../shared/constants/message-types";
import Auth from "./modules/auth";
import CommentBackground from "./modules/comment";
import { getCurrentTab } from "../shared/utils/tabs";
import logger from "../shared/utils/logger";

const auth = new Auth();
const comments = new CommentBackground();

chrome.runtime.onMessage.addListener(async (request) => {
  switch (request.type) {
    // listen to the event
    case MessageType.GET_COMMENT:
      await comments.processGenerateCommentRequest(request);
      break;
    case MessageType.START_AUTH:
      await auth.start_auth();
      await auth.check_for_auth_code();
      break;
    case MessageType.RELOAD_CREDITS_LIMIT:
      await comments.update_credits();
      break;
    default:
      console.log("unknown request type", request.type);
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, _tab) => {
  const currentTab = await getCurrentTab();
  if (changeInfo.url?.includes("/feed") && tabId === currentTab.id) {
    logger.info("Sending request to reattach card");
    chrome.tabs.sendMessage(currentTab?.id || 0, {
      type: MessageType.FEED_RELOAD,
    });
  }
});
