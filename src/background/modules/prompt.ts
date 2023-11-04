import { storage } from "webextension-polyfill";
import STORAGE_KEYS from "../../shared/constants/storage-keys";
import logger from "../../shared/utils/logger";
import { API } from "../constant";

type ResponseCallback = (data: any) => void;
type Message = {
  action: "fetch";
  value: null;
};

class PromptService {
  async get_header() {
    var myHeaders = new Headers();
    const token = await storage.local.get(STORAGE_KEYS.TOKEN);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token.TOKEN}`);
    myHeaders.append("ngrok-skip-browser-warning", "true");
    return myHeaders;
  }

  //FETCH PROMPTS
  async get_prompts(_: Message, response: ResponseCallback) {
    const headers = await this.get_header();
    try {
      const res = await fetch(`${API}/prompt`, {
        method: "GET",
        headers,
      });

      const prompts = await res.json();
      response({ message: "success", data: prompts });
    } catch (error) {
      logger.error("Fetching prompts Failed");
      response({ message: "error", data: null });
    }
  }
  //SAVE PROMPTS
  async save_prompt(message: { prompt: any }, response: ResponseCallback) {
    const headers = await this.get_header();

    try {
      const res = await fetch(`${API}/prompt`, {
        method: "POST",
        headers,
        body: JSON.stringify(message.prompt),
      });

      const prompt = await res.json();
      response({ message: "success", data: prompt });
    } catch (error) {
      logger.error("Fetching prompts Failed");
      response({ message: "error", data: null });
    }
  }
  //UPDATE PROMPTS
  async update_prompt(message: { prompt: any }, response: ResponseCallback) {
    const headers = await this.get_header();

    try {
      const res = await fetch(`${API}/prompt/${message.prompt?._id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(message.prompt),
      });

      const prompt = await res.json();
      response({ message: "success", data: prompt });
    } catch (error) {
      logger.error("Fetching prompts Failed");
      response({ message: "error", data: null });
    }
  }
  //Update Default Prompts
  async update_default_prompts(message: { prompt: any }, response: ResponseCallback) {
    const headers = await this.get_header();

    try {
      const res = await fetch(`${API}/prompt/disable-default-prompt`, {
        method: "POST",
        headers,
        body: JSON.stringify(message.prompt),
      });

      const prompt = await res.json();
      if (prompt) {
        response({ message: "success", data: prompt });
      }
    } catch (error) {
      logger.error("Fetching prompts Failed");
      response({ message: "error", data: null });
    }
  }
  //DELETE PROMPTS
  async delete_prompt(message: { promptId: string }, response: ResponseCallback) {
    const headers = await this.get_header();

    try {
      const res = await fetch(`${API}/prompt/${message.promptId}`, {
        method: "DELETE",
        headers,
      });

      await res.json();
      response({ message: "success", data: "" });
    } catch (error) {
      logger.error("Fetching prompts Failed");
      response({ message: "error", data: null });
    }
  }

  //SEND FEEDBACK
  async send_feedback(message: { feedback: string }, response: ResponseCallback) {
    const headers = await this.get_header();

    try {
      const res = await fetch(`${API}/feedback`, {
        method: "POST",
        body: JSON.stringify({ feedback: message.feedback }),
        headers,
      });

      await res.json();
      response({ message: "success", data: "" });
    } catch (error) {
      logger.error("Sending Feedback Failed");
      response({ message: "error", data: null });
    }
  }
}

export default PromptService;
