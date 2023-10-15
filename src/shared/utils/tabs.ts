export function getCurrentTab(): Promise<chrome.tabs.Tab> {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      resolve(currentTab);
    });
  });
}
