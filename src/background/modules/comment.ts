import { storage } from "webextension-polyfill";
import STORAGE_KEYS from "../../shared/constants/storage-keys";
import { API } from "./auth";
import logger from "../../shared/utils/logger";

type ResponseCallback = (data: any) => void;
type Message = {
  action: "fetch";
  value: null;
};

class CommentBackground {
  //FETCH PLAN
  async update_credits(_: Message, response: ResponseCallback) {
    const token = await storage.local.get(STORAGE_KEYS.TOKEN);
    console.log(token);
    var myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token.TOKEN}`);

    try {
      const res = await fetch(`${API}/auth/get-plan`, {
        method: "POST",
        headers: myHeaders,
      });

      const plan = await res.json();
      response({ message: "success", data: plan });
    } catch (error) {
      logger.error("Fetching Plan Failed");
      response({ message: "error", data: null });
    }
  }

  //GENERATE COMMENT
  async processGenerateCommentRequest(
    msg: { commentType: string; description: string },
    response: ResponseCallback
  ) {
    try {
      const token = await storage.local.get(STORAGE_KEYS.TOKEN);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token.TOKEN}`);
      const res = await fetch(`${API}/comment/generate-comment`, {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          commentType: msg.commentType,
          description: msg.description,
        }),
      });

      const json = await res.json();
      const comment = json.comment;

      response({ message: "success", data: comment });
    } catch (error) {
      logger.error("Generating Comment Failed");
      response({ message: "error", data: null });
    }
  }
}

export default CommentBackground;
