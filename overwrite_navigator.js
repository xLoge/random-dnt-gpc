let enableDNT;
let enableGPC;

browser.runtime.sendMessage({ action: 'get-dnt-state' }).then(function(response) {
  enableDNT = response.state;
  if (enableDNT === 'disabled') {
    return;
  }

  var script = document.createElement('script');
  script.textContent = `
    Object.defineProperty(navigator, 'doNotTrack', {
      value: ${enableDNT ? '1' : ''},
      writable: false,
      configurable: false
    });
  `;
  document.documentElement.appendChild(script);
  script.remove();
});

browser.runtime.sendMessage({ action: 'get-gpc-state' }).then(function(response) {
  enableGPC = response.state;
  if (enableGPC === 'disabled') {
    return;
  }

  var script = document.createElement('script');
  script.textContent = `
    Object.defineProperty(navigator, 'globalPrivacyControl', {
      value: ${enableGPC ? true : undefined},
      writable: false,
      configurable: false
    });
  `;
  document.documentElement.appendChild(script);
  script.remove();
});