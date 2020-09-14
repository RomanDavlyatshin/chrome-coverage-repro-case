var DEVTOOLS_VERSION = "1.3";

chrome.runtime.onMessage.addListener(async (request) => {
  if (request.action == "start") {
    await start(request.tab);
  }

  if (request.action == "stop") {
    const data = await stop(request.tab);
    console.log(data);
    debugger;
  }
});

const start = async (tab) => {
  const target = {
    tabId: tab.id
  };
  await devTools.attach(target, DEVTOOLS_VERSION)
  await devTools.sendCommand(target, "Profiler.enable");
  await devTools.sendCommand(target, "Profiler.startPreciseCoverage", {
    callCount: false,
    detailed: true
  });
  await devTools.sendCommand(target, "Debugger.enable");
  await devTools.sendCommand(target, "Debugger.setSkipAllPauses", { skip: true });
}

const stop = async (tab) => {
  const target = {
    tabId: tab.id
  };
  const data = await devTools.sendCommand(target, "Profiler.takePreciseCoverage");
  await devTools.sendCommand(target, "Profiler.stopPreciseCoverage");
  await devTools.sendCommand(target, "Profiler.disable");
  await devTools.sendCommand(target, "Debugger.disable");
  await devTools.detach(target)
  return data.result;
}

const asPromised = (block) => {
  return new Promise((resolve, reject) => {
    block((...results) => {
      if (chrome.runtime.lastError) {
        reject(chrome.extension.lastError);
      } else {
        resolve(...results);
      }
    });
  });
};

const devTools = {
  attach(target, version) {
    return asPromised(callback => {
      chrome.debugger.attach(target, version, callback)
    })
  },

  sendCommand(target, method, params) {
    return asPromised(callback => {
      chrome.debugger.sendCommand(target, method, params, callback)
    })

  },

  detach(target) {
    return asPromised(callback => {
      chrome.debugger.detach(target, callback)
    })
  }
}
