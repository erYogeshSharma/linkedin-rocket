import { storage } from "webextension-polyfill";
import STORAGE_KEYS from "../../shared/constants/storage-keys";
import logger from "../../shared/utils/logger";
import { API } from "../constant";

type ResponseCallback = (data: any) => void;
type Message = {
  action: "fetch";
  value: null;
};

class SubscriptionService {
  async get_header() {
    var myHeaders = new Headers();
    const token = await storage.local.get(STORAGE_KEYS.TOKEN);
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token.TOKEN}`);
    myHeaders.append("ngrok-skip-browser-warning", "true");
    return myHeaders;
  }

  //FETCH PROMPTS
  async get_plans(_: Message, response: ResponseCallback) {
    const headers = await this.get_header();
    try {
      const res = await fetch(`${API}/plan`, {
        method: "GET",
        headers,
      });

      const plans = await res.json();
      response({ message: "success", data: plans });
    } catch (error) {
      logger.error("PLANS:Fetching plans Failed");
      response({ message: "error", data: null });
    }
  }
  //SAVE PROMPTS
  async get_payment_url(message: { planId: string }, response: ResponseCallback) {
    const headers = await this.get_header();

    try {
      const res = await fetch(`${API}/plan/create-subscription`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          planId: message.planId,
        }),
      });

      const link = await res.json();
      response({ message: "success", data: link });
    } catch (error) {
      logger.error("Fetching prompts Failed");
      response({ message: "error", data: null });
    }
  }
  //UPDATE PROMPTS
  async confirm_payment_status(message: { subscriptionId: string }, response: ResponseCallback) {
    const headers = await this.get_header();

    try {
      const res = await fetch(`${API}/plan/confirm-subscription/${message.subscriptionId}`, {
        method: "GET",
        headers,
      });

      const plan = await res.json();
      if (plan._id) {
        response({ message: "success", data: plan });
      }
    } catch (error) {
      logger.error("Fetching prompts Failed");
      response({ message: "error", data: null });
    }
  }
}

export default SubscriptionService;
