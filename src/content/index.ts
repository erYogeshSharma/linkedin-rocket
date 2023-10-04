import "./content.css";
import attachButton from "./ui/react";
import LinkedInClasses from "../shared/constants/linkedin-classes";
import AccountCard from "./ui/account-card";

const accountCard = new AccountCard();
accountCard.init();
document.addEventListener("focusin", async (event: FocusEvent) => {
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
