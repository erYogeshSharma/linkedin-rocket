import ExtensionClasses from "../../shared/constants/extension-classes";
import LinkedInClasses from "../../shared/constants/linkedin-classes";
import MessageType from "../../shared/constants/message-types";
import STORAGE_KEYS from "../../shared/constants/storage-keys";
import extensionStorage from "../../shared/storage/storage";
import { User } from "../../shared/types/user";
import logger from "../../shared/utils/logger";

import GuestCardHTML from '../html/guestCard'
import UserCardHTML from '../html/userCard'

class AccountCard {
  user: User = {} as User;

  constructor() {}

  //INIT

  async init() {
    const scaffold = document.querySelector("." + LinkedInClasses.SCAFFOLD);
    const isCardAttached = scaffold?.classList.contains(ExtensionClasses.ACCOUNT_CARD_ATTACHED);
    if (!scaffold) {
      logger.error("Scaffold not found");
      return;
    }

    if (scaffold && !isCardAttached) {
      let HTML  = GuestCardHTML;   
      const user = await extensionStorage.get(STORAGE_KEYS.USER);
      const plan = await chrome.storage.local.get(STORAGE_KEYS.PLAN);
  
      this.user = user;

      if (user?.firstName) {
        HTML = UserCardHTML
      }

      scaffold.innerHTML = HTML + scaffold.innerHTML;
      scaffold.classList.add(ExtensionClasses.ACCOUNT_CARD_ATTACHED);
      logger.success("Account Card Attached");
      this.update_comments_used();
      if (!user?.firstName) {
        this.listen_for_auth();
      }
      return;
    } else if (isCardAttached) {
      logger.info("Account Card Already Attached");
      return;
    }
  }

  listen_for_auth() {
    const auth_btn = document.querySelector("." + ExtensionClasses.AUTH_BUTTON);
    auth_btn?.addEventListener("click", () => {
      logger.info("Auth Button Clicked");
      chrome.runtime.sendMessage({ type: MessageType.START_AUTH });
      this.listen_for_redirect();
    });
  }

  async update_comments_used() {
    const reload_button = document.querySelector("." + "refresh_credits");
    reload_button?.addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: MessageType.RELOAD_CREDITS_LIMIT });
    });

    chrome.runtime.onMessage.addListener(async (message) => {
      console.log({ message });
      if (message.type === "COMMENT_GENERATED") {
        const plan = await chrome.storage.local.get(STORAGE_KEYS.PLAN);
        const element = document.querySelector(".comments_used");
        console.log(element?.innerHTML);
        if (element) {
          const data = `${plan?.PLAN?.creditsUsed}/${plan?.PLAN?.totalCredits} comments used`;
          element.innerHTML = data;
        }
        // Handle data change here and update the webpage
        // You can retrieve data from local storage using chrome.storage.local.get()
      }
    });
  }

  listed_for_feed_reload() {
    chrome.runtime.onMessage.addListener((request) => {
      if (request.type === MessageType.FEED_RELOAD) {
        this.init();
      }
    });
  }

  listen_for_redirect() {
    chrome.runtime.onMessage.addListener((request) => {
      if ((request.type = MessageType.REDIRECT_AUTH_URL)) {
        window.location.href = request.url;
      }
    });
  }
}

export default AccountCard;
