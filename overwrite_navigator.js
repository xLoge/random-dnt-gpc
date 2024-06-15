browser.runtime.sendMessage({ action: 'get-dnt-gpc-state' }).then(function(response) {
  let enableDNT = response.states.DNT;
  let enableGPC = response.states.GPC;

  if (enableDNT !== -1)
  {
    let script = document.createElement('script');
    script.textContent = `
      Object.defineProperty(navigator, 'doNotTrack', {
        value: ${enableDNT ? '1' : ''},
        writable: false,
        configurable: false
      });
    `;
    document.documentElement.appendChild(script);
    script.remove();
  }

  if (enableGPC !== -1)
  {
    let script = document.createElement('script');
    script.textContent = `
      Object.defineProperty(navigator, 'globalPrivacyControl', {
        value: ${enableGPC ? true : false},
        writable: false,
        configurable: false
      });
    `;
    document.documentElement.appendChild(script);
    script.remove();
  }
});
