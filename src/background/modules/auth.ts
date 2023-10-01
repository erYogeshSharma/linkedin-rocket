import MessageType from "../../shared/constants/message-types";
import STORAGE_KEYS from "../../shared/constants/storage-keys";
import extensionStorage from "../../shared/storage/storage";

export const API = "https://b371-2401-4900-1cc4-f670-1db8-77bd-68ce-e186.ngrok-free.app";
function getCurrentTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      resolve(currentTab);
    });
  });
}
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
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
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
      await extensionStorage.save(STORAGE_KEYS.USER, data.user);
      await extensionStorage.save(STORAGE_KEYS.TOKEN, data.token);
      this.isAuthenticating = false;
    } catch (error) {
      this.isAuthenticating = false;
      console.log(error);
    }
  }
}

export default Auth;
