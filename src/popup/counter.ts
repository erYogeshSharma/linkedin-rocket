export function setupCounter(element: HTMLButtonElement) {
  element.addEventListener("click", () => {
    chrome.runtime.sendMessage({
      type: "start-auth",
    });
  });
}
