import "./content.css";
import attachButton from "./components/comment-button";
import LinkedInClasses from "../shared/constants/linkedin-classes";
import ExtensionClasses from "../shared/constants/extension-classes";
import logger from "../shared/utils/logger";
import AttachAccountCard from "./components/auth-card/index";

document.addEventListener("focusin", async (event: any) => {
  attachAccountCard();
  if (event?.target?.classList?.contains(LinkedInClasses.QL_EDITOR)) {
    const parentForm = event.target?.closest("." + LinkedInClasses.COMMENT_BOX);
    console.log(parentForm.classList.contains("crx-root"));
    if (parentForm && !parentForm.classList.contains("crx-root")) {
      // add appended class to add buttons only on the first event trigger
      // this.add_comment_buttons(parentForm);
      attachButton(parentForm);
    } else {
      console.log(
        "No parent with the class 'comments-comment-texteditor' found for the focused element."
      );
    }
  }
});

async function attachAccountCard() {
  const scaffold = document.querySelector("." + LinkedInClasses.SCAFFOLD);
  const isCardAttached = scaffold?.classList.contains(ExtensionClasses.ACCOUNT_CARD_ATTACHED);
  if (!scaffold) {
    logger.error("Scaffold not found");
    return;
  }

  if (scaffold && !isCardAttached) {
    AttachAccountCard(scaffold);
  }
}
