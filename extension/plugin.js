const sendMessage = (message, callback) => {
  chrome.runtime.sendMessage(message, callback);
}

const onStart = () => {
  document
    .getElementById("startCoverage")
    .addEventListener("click", () => {
      const message = document.getElementById("message");
      message.textContent = "collecting";
      chrome.tabs.getSelected(null, (tab) => {
        sendMessage({ "action": "start", "tab": tab })
      });
    }, false);
};

const results = []

const onStop = () => {
  document.getElementById("stopCoverage").addEventListener("click", () => {
    const message = document.getElementById("message");
    message.textContent = "idle";

    chrome.tabs.getSelected(null, (tab) => {
      sendMessage({ "action": "stop", "tab": tab }, (results) => {
        console.log(results);
        debugger;
      })
    });
  }, false);
};

document.addEventListener("DOMContentLoaded", onStart, false);
document.addEventListener("DOMContentLoaded", onStop, false);
