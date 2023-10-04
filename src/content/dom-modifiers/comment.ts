export default function emulateWriting(parent: HTMLElement, text: string) {
  let input = parent.querySelector(".ql-editor p") as HTMLElement;
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
      input?.parentElement?.classList.remove("ql-blank");
    }
  }, 10);
}
