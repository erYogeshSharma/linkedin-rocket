import { storage } from "webextension-polyfill";
import STORAGE_KEYS from "../../shared/constants/storage-keys";
import { API } from "../constant";

type ResponseCallback = (data: any) => void;
type Message = {
  action: "fetch";
  value: null;
};

class Auth {
  isAuthenticating: boolean;
  constructor() {
    this.isAuthenticating = false;
  }

  async start_auth(_: Message, response: ResponseCallback) {
    try {
      const res = await fetch(`${API}/auth/auth-url`, { method: "post" });
      const data = await res.json();
      response({ message: "success", data: data.url });
    } catch (error) {
      response({ message: "null", error: "Unknown action" });
    }
  }

  async register_token(message: { token: string }, response: ResponseCallback) {
    console.log({ message });
    try {
      const res = await fetch(`${API}/auth/auth-code/${message.token}`, { method: "post" });
      const data = await res.json();
      await storage.local.set({ [STORAGE_KEYS.TOKEN]: data.token });
      response({ message: "success", data: data });
    } catch (error) {
      response({ message: "error", data: null });
      console.log(error);
    }
  }
}

export default Auth;
