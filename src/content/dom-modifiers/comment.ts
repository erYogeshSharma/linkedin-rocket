import EXTENSION_CLASSES from "../../shared/constants/extension-classes";
import LinkedInClasses from "../../shared/constants/linkedin-classes";

class CommentButtons {
  loading: boolean;
  processButton: EventTarget | null = null;
  processParent: EventTarget | null = null;

  constructor() {
    this.loading = false;
  }

  processButtonClicked(event: FocusEvent, buttonType: string, parentForm: Element) {
    // check if we already loading the response
    if (this.loading) {
      console.log("already loading");
      return;
    }
    // disable all other buttons to avoid multiple comments creation simultaneously
    document.querySelectorAll(".rounded-button").forEach(function (button) {
      if (button.id !== "expertBtn") {
        button.setAttribute("disabled", "true");
        button.classList.add("disabled");
      }
    });

    // add pulse animation to the clicked button
    event.currentTarget.classList.add(EXTENSION_CLASSES.LOADING_ANIMATION);

    // extract full text of the parent post
    const parent = event.currentTarget.closest("." + LinkedInClasses.POST_PARENT);
    const elements = parent.getElementsByClassName(LinkedInClasses.POST_DESCRIPTION);
    let text = elements[0]?.innerText;
    const textWithoutSeeMore = text.replace(/…see more/g, "");

    // save current state of the app
    this.loading = true;
    this.processButton = event.currentTarget;
    this.processParent = parentForm;

    chrome.runtime.sendMessage({
      type: "generate-comment",
      buttonType: buttonType,
      event: event,
      parentForm: parentForm,
      text: textWithoutSeeMore,
    });
  }

  add_comments_button(event: FocusEvent) {
    const parentForm = event.target.closest("." + LinkedInClasses.COMMENT_BOX);
    if (parentForm && !parentForm.classList.contains("buttons-appended")) {
      const buttonLabels = [
        "Supportive 👏",
        "Inquisitive ❓",
        "Appreciative 🙌",
        "Thoughtful 💭",
        "Relatable 💬",
        "Feedback 📝",
        "Gratitude 🙏",
        "Educational 📚",
        "Networking 🤝",
        "Humorous 😄",
      ];
      // add appended class to add buttons only on the first event trigger
      parentForm.classList.add("buttons-appended");

      buttonLabels.forEach((label) => {
        let button = document.createElement("button");
        button.classList.add("rounded-button");
        button.innerText = label;

        // Append each button to the parent form
        parentForm.appendChild(button);

        // Add click event listeners to each button
        button.addEventListener("click", (event) => {
          // Handle button click here
          this.processButtonClicked(event, label, parentForm);
        });
      });
    } else {
      console.log(
        "No parent with the class 'comments-comment-texteditor' found for the focused element."
      );
    }
  }

  emulateWriting(text: string) {
    let input = this.processParent.querySelector(".ql-editor.ql-blank p");
    let i = 0;
    let interval = setInterval(() => {
      if (i < text.length) {
        input.innerText += text[i];
        i++;
        for (let j = 0; j < 10; j++) {
          if (i < text.length) {
            input.innerText += text[i];
            i++;
          }
        }
      } else {
        clearInterval(interval);
        // we need to remove `ql-blank` style from the section by LinkedIn div processing logic
        input.parentElement.classList.remove("ql-blank");
      }
    }, 10);
  }

  write_comment(comment: string) {
    this.loading = false;
    document.querySelectorAll("." + EXTENSION_CLASSES.ROUNDED_BUTTON).forEach(function (button) {
      button.removeAttribute("disabled");
      button.classList.remove(EXTENSION_CLASSES.DISABLED_BUTTON);
    });
    this.processButton.classList.remove(EXTENSION_CLASSES.LOADING_ANIMATION);

    this.emulateWriting(comment);
  }
}

export default CommentButtons;
