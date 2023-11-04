import attachButton from "./components/comment-button";
import LinkedInClasses from "../shared/constants/linkedin-classes";
import logger from "../shared/utils/logger";
import AttachAccountCard from "./components/auth-card/index";

attachAccountCard();

document.addEventListener("focusin", async (event: any) => {
  if (event?.target?.classList?.contains(LinkedInClasses.QL_EDITOR)) {
    const parentForm = event.target?.closest("." + LinkedInClasses.COMMENT_BOX);
    console.log(parentForm.classList.contains("crx-root"));
    if (parentForm && !parentForm.classList.contains("crx-root")) {
      attachButton(parentForm);
    } else {
      console.log(
        "No parent with the class 'comments-comment-texteditor' found for the focused element."
      );
    }
  }
});

async function attachAccountCard() {
  function handleDOMChange() {
    const scaffold = document.querySelector("." + LinkedInClasses.SCAFFOLD);
    const isCardAttached = scaffold?.classList.contains("rkt_account_card_attached");
    if (!scaffold) {
      logger.error("Scaffold not found");
      return;
    }

    if (scaffold && !isCardAttached) {
      AttachAccountCard(scaffold);
    }
  }

  const observerConfig: MutationObserverInit = { attributes: true, childList: true, subtree: true };

  const observer = new MutationObserver(handleDOMChange);

  observer.observe(document.body, observerConfig);

  // To disconnect the observer when you no longer need it
  // observer.disconnect();
}
