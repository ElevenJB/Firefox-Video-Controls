browser.commands.onCommand.addListener((command) => {
  if (command === "toggle-panel") {
    browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        browser.tabs.sendMessage(tabs[0].id, {command: "toggle-panel"});
      }
    });
  }
});
