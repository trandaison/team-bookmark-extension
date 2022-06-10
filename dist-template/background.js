chrome.commands.onCommand.addListener((command) => {
  console.log(`Command: ${command}`);

  // chrome.action.openPopup({
  //   callback() {
  //     console.log('open popup');
  //   },
  // });
});

chrome.action.onClicked.addListener((tab) => {
  console.log(`Action: ${tab}`);
  // chrome.scripting.executeScript({
  //   target: { tabId: tab.id },
  //   func: contentScriptFunc,
  //   args: ['action'],
  // });
});

function contentScriptFunc(name) {
  console.log(`Action: ${name}`);
}
