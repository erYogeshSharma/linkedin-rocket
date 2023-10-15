import MessageType from "../../shared/constants/message-types";
import STORAGE_KEYS from "../../shared/constants/storage-keys";
import extensionStorage from "../../shared/storage/storage";
import logger from "../../shared/utils/logger";
import { getCurrentTab } from "../../shared/utils/tabs";

export const API = "https://ee98-2401-4900-1cc4-760f-c605-dbaf-29a-fb71.ngrok-free.app";

class Auth {
  isAuthenticating: boolean;

  constructor() {
    this.isAuthenticating = false;
  }

  async start_auth() {
    try {
      const response = await fetch(`${API}/auth/auth-url`, { method: "post" });
      const data = await response.json();
      const currentTab = await getCurrentTab();

      chrome.tabs.sendMessage(currentTab?.id || 0, {
        type: MessageType.REDIRECT_AUTH_URL,
        url: data.url,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async check_for_auth_code() {
    chrome.tabs.onUpdated.addListener((_tabId, changeInfo, _tab) => {
      if (changeInfo.url?.includes("linkedin")) {
        const url = new URL(changeInfo.url);
        let search = url.search;

        if (search.includes("?code=")) {
          let code = search.replace("?code=", "");
          if (!this.isAuthenticating) {
            this.authenticate(code);
          }
        }
      }
    });
  }

  async authenticate(access_code: string) {
    try {
      this.isAuthenticating = true;
      const response = await fetch(`${API}/auth/auth-code/${access_code}`, { method: "post" });
      const data = await response.json();
      await extensionStorage.save(STORAGE_KEYS.PLAN, data.plan);
      await extensionStorage.save(STORAGE_KEYS.USER, data.user);
      await extensionStorage.save(STORAGE_KEYS.TOKEN, data.token);
      const currentTab = await getCurrentTab();
      chrome.tabs.update(currentTab.id || 0, { url: "https://www.linkedin.com/feed" }, () => {
        logger.info("Code removed from URL");
      });
      this.isAuthenticating = false;
    } catch (error) {
      this.isAuthenticating = false;
      console.log(error);
    }
  }
}

export default Auth;
