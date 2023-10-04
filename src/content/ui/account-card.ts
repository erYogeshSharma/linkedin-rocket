import ExtensionClasses from "../../shared/constants/extension-classes";
import LinkedInClasses from "../../shared/constants/linkedin-classes";
import MessageType from "../../shared/constants/message-types";
import STORAGE_KEYS from "../../shared/constants/storage-keys";
import extensionStorage from "../../shared/storage/storage";
import { User } from "../../shared/types/user";
import logger from "../../shared/utils/logger";

const GuestCardHtml = `<div class="rkt_account_card">
<div>
  <div style="display: flex; flex-direction: column; align-items: center; padding: 10px">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 5px">
      <img />
      <p class="rkt_title"> Comments Rocket</p>
    </div>
    <p class="rkt_desc" >Sign in with LinkedIn to get Started with Comment Rocket</p>
    <button class="rkt_button rkt_auth_button">Sign in with linkedin</button>
  </div>
  <div style="width: 100%; padding:0">
    <hr />
  </div>
  <div style="display: flex; flex-direction: column; align-items: center; padding-bottom:10px ; ">
    <a class="rkt_link">Terms of use</a>
    <a class="rkt_link">Privacy Policy</a>
  </div>
</div>
</div>
`;

const UserCardHtml = (user: User, token: number) => {
  return ` <div class="rkt_account_card">
  <div>
    <div style="display: flex; flex-direction: column; align-items: center;padding: 10px">
    <div style="display: flex; flex-direction: row; align-items: center; gap: 5px">
    <img />
    <div class="rkt_title">Comments Rocket</div>
    </div>
    <div style="display: flex; flex-direction: column; align-items: center ;margin-top:20px ;    ">
      <div class="rkt_desc p_m_0">Welcome ${user.firstName}!</div>
      <div class="rkt_desc p_m_0">Free Plan</div>
      <div class="rkt_desc p_m_0">${token}/3 comments used</div>
      </div>
      <button style="margin-top: 10px" class="rkt_button change_plan_btn">Change Plan</button>
    </div>

    
    <div style="width: 100%;padding:0">
      <hr />
    </div>

    <div
      style="display: flex; flex-direction: column; align-items: center; padding-bottom: 10px"
    >
      <a class="rkt_link">Terms of use</a>
      <a class="rkt_link">Privacy Policy</a>
    </div>
  </div>
</div>`;
};

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
      let HTML = GuestCardHtml;

      const user = await extensionStorage.get(STORAGE_KEYS.USER);
      this.user = user;

      if (user?.firstName) {
        HTML = UserCardHtml(user, 20);
      }

      scaffold.innerHTML = HTML + scaffold.innerHTML;
      scaffold.classList.add(ExtensionClasses.ACCOUNT_CARD_ATTACHED);
      logger.success("Account Card Attached");

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

  listen_for_redirect() {
    chrome.runtime.onMessage.addListener(function (request) {
      if ((request.type = MessageType.REDIRECT_AUTH_URL)) {
        window.location.href = request.url;
      }
    });
  }
}

export default AccountCard;
