document.getElementById('open-panel').addEventListener('click', () => {
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {command: "toggle-panel"});
    window.close();
  });
});

document.getElementById('reset-all').addEventListener('click', () => {
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {command: "reset-all"});
    window.close();
  });
});
