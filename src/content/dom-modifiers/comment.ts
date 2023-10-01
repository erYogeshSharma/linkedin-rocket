import EXTENSION_CLASSES from "../../shared/constants/extension-classes";
import LinkedInClasses from "../../shared/constants/linkedin-classes";
import STORAGE_KEYS from "../../shared/constants/storage-keys";
import extensionStorage from "../../shared/storage/storage";
const buttonTypes = [
  {
    label: "👏 Supportive",
    value: "Supportive",
  },
  {
    label: "❓ Inquisitive",
    value: "Inquisitive",
  },
  {
    label: "🙌 Appreciative",
    value: "Appreciative",
  },
  {
    label: "💭 Thoughtful",
    value: "Thoughtful",
  },
  {
    label: "💬 Relatable",
    value: "Relatable",
  },
  {
    label: "📝 Feedback",
    value: "Feedback",
  },
  {
    label: "🙏 Gratitude",
    value: "Gratitude",
  },
  {
    label: "📚 Educational",
    value: "Educational",
  },
  {
    label: "🤝 Networking",
    value: "Networking",
  },
  {
    label: "😄 Humorous",
    value: "Humorous",
  },
];

class CommentButtons {
  loading: boolean;
  isAuthenticated: boolean = false;
  processButton: EventTarget | null = null;
  processParent: EventTarget | null = null;

  constructor() {
    this.loading = false;
    this.isAuthenticated = false;
  }

  add_comment_buttons(parentForm: Element) {
    parentForm.classList.add("buttons-appended");

    buttonTypes.forEach((label) => {
      let button = document.createElement("button");
      button.classList.add("rounded-button");
      button.innerText = label.label;

      if (!this.isAuthenticated) {
        button.setAttribute("disabled", "true");
        button.classList.add("disabled");
      }

      // Append each button to the parent form
      parentForm.appendChild(button);

      // Add click event listeners to each button
      button.addEventListener("click", (event) => {
        // Handle button click here

        this.processButtonClicked(event, label.value, parentForm);
      });
    });
  }

  add_auth_button(parentForm: Element) {
    let button = document.createElement("button");
    button.classList.add("rounded-button");
    button.innerText = "Sign In";
    parentForm.appendChild(button);
    button.addEventListener("click", (event) => {
      // Handle button click here
      chrome.runtime.sendMessage({
        type: "start-auth",
      });
    });
  }

  add_logout_button(parentForm: Element) {
    let button = document.createElement("button");
    button.classList.add("rounded-button");
    button.innerText = "Sign Out";
    parentForm.appendChild(button);
    button.addEventListener("click", async (event) => {
      // Handle button click here
      await extensionStorage.save(STORAGE_KEYS.TOKEN, "");

      window.location.reload();
    });
  }

  async init() {
    const token = await extensionStorage.get(STORAGE_KEYS.TOKEN);
    console.log(token);
    this.isAuthenticated = token?.length > 0;

    document.addEventListener("focusin", async (event: FocusEvent) => {
      if (event.target.classList.contains(LinkedInClasses.QL_EDITOR)) {
        const parentForm = event.target.closest("." + LinkedInClasses.COMMENT_BOX);

        if (parentForm && !parentForm.classList.contains("buttons-appended")) {
          // add appended class to add buttons only on the first event trigger
          this.add_comment_buttons(parentForm);

          if (!this.isAuthenticated) {
            this.add_auth_button(parentForm);
          } else {
            this.add_logout_button(parentForm);
          }
        } else {
          console.log(
            "No parent with the class 'comments-comment-texteditor' found for the focused element."
          );
        }
      }
    });
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

  write_comment(comment: string) {
    this.loading = false;
    document.querySelectorAll("." + EXTENSION_CLASSES.ROUNDED_BUTTON).forEach(function (button) {
      button.removeAttribute("disabled");
      button.classList.remove(EXTENSION_CLASSES.DISABLED_BUTTON);
    });
    this.processButton.classList.remove(EXTENSION_CLASSES.LOADING_ANIMATION);
    if (comment) {
      this.emulateWriting(comment);
    }
  }

  emulateWriting(text: string) {
    let input = this.processParent.querySelector(".ql-editor p");
    input.innerText = " ";
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
}

export default CommentButtons;
