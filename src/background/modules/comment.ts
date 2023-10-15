import STORAGE_KEYS from "../../shared/constants/storage-keys";
import extensionStorage from "../../shared/storage/storage";
import logger from "../../shared/utils/logger";
import { getCurrentTab } from "../../shared/utils/tabs";
import { API } from "./auth";

class CommentBackground {
  async update_credits() {
    const token = await extensionStorage.get(STORAGE_KEYS.TOKEN);
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);
    const res = await fetch(`${API}/auth/get-plan`, {
      method: "POST",
      headers: myHeaders,
    });

    const response = await res.json();
    const currentTab = await getCurrentTab();
    if (response) {
      extensionStorage.save(STORAGE_KEYS.PLAN, response);
      chrome.tabs.sendMessage(
        currentTab.id as number,
        { type: "COMMENT_GENERATED" },
        async function () {
          logger.info("Tokens left updated");
        }
      );
    }
  }

  async processGenerateCommentRequest(request: any) {
    let response: {
      type: string;
      error?: any;
      parentForm?: Element;
      comment?: string;
    } = {
      type: "generate-comment-response",
      error: "something went wrong",
    };

    const currentTab = await getCurrentTab();
    try {
      const token = await extensionStorage.get(STORAGE_KEYS.TOKEN);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);
      const res = await fetch(`${API}/comment/generate-comment`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          commentType: request.buttonType,
          description: request.description,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const json = await res.json();
      const comment = json.comment;

      response = {
        type: "generate-comment-response",
        parentForm: request.parentForm,
        comment: comment,
      };
      if (comment) {
        chrome.tabs.sendMessage(
          currentTab.id as number,
          { type: "COMMENT_GENERATED" },
          async function () {
            logger.info("Tokens left updated");
          }
        );
      }
    } catch (error) {
      response = {
        type: "generate-comment-response-expired",
        error: error,
      };
    }

    // send the event with response

    chrome.tabs.sendMessage(currentTab.id as number, response, async function (response) {
      logger.info("Comment generated");
    });

    const store = await chrome.storage.local.get();
    const plan = store?.PLAN;
    const credits = plan.creditsUsed + 1;
    await extensionStorage.save("PLAN", { ...plan, creditsUsed: credits });
  }
}

export default CommentBackground;
