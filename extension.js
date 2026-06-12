document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("toggle");

  chrome.storage.sync.get(["disabled"], (result) => {
    toggle.checked = !result.disabled;
  });

  toggle.addEventListener("change", () => {
    const disabled = !toggle.checked;
    chrome.storage.sync.set({ disabled });

    chrome.tabs.query({ url: "https://github.com/*/*/pull/*" }, (tabs) => {
      for (const tab of tabs) {
        chrome.tabs
          .sendMessage(tab.id, { action: disabled ? "disable" : "enable" })
          .catch(() => {});
      }
    });
  });
});
