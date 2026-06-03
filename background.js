// background.js
const runtime = typeof browser !== 'undefined' ? browser : chrome;

runtime.commands.onCommand.addListener((command) => {
  if (command === "toggle-panel") {
    runtime.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        runtime.tabs.sendMessage(tabs[0].id, {command: "toggle-panel"});
      }
    });
  }
});
