let randomizeDNT = true;
let randomizeGPC = true;

function getRandomBool() {
    return (Math.random() < 0.5) ? true : false;
}

let randomDNTstate = getRandomBool();
let randomGPCstate = getRandomBool();

function modifyRequestHeader(header)
{
    let found;

    if (randomizeDNT) {
        if (randomDNTstate) {
            found = false;
            for (let h of header) {
                if (h.name === 'DNT') {
                    h.value = '1';
                    found = true;
                    break;
                }
            }
            if (!found) {
                header.push({ name: 'DNT', value: '1' });
            }
        }
        else {
            header = header.filter(header => header.name !== 'DNT');
        }
    }

    if (randomizeGPC) {
        if (randomGPCstate) {
            found = false;
            for (let h of header) {
                if (h.name === 'Sec-GPC') {
                    h.value = '1';
                    found = true;
                    break;
                }
            }
            if (!found) {
                header.push({ name: 'Sec-GPC', value: '1' });
            }
        }
        else {
            header = header.filter(header => header.name !== 'Sec-GPC');
        }
    }
    return header;
}

browser.webRequest.onBeforeSendHeaders.addListener((details) => { 
    return { requestHeaders: modifyRequestHeader(details.requestHeaders) };
},
  { urls: ["<all_urls>"] },
  ["blocking", "requestHeaders"]
);

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'toggle-dnt') {
    randomizeDNT = !randomizeDNT;
    browser.storage.local.set({ randomizeDNT });
  }
});

browser.runtime.onMessage.addListener((message) => {
    if (message.action === 'toggle-gpc') {
        randomizeGPC = !randomizeGPC;
      browser.storage.local.set({ randomizeGPC });
    }
  });

// Load the saved state on startup
browser.storage.local.get('DNT').then((data) => {
  if (data.DNT !== undefined) {
    randomizeDNT = data.DNT;
  }
});
// Load the saved state on startup
browser.storage.local.get('GPC').then((data) => {
    if (data.GPC !== undefined) {
        randomizeGPC = data.GPC;
    }
  });

browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'get-dnt-state') {
        if (randomizeDNT) {
            sendResponse({ state: randomDNTstate });
        }
        else {
            sendResponse({ state: 'disabled' });
        }
        randomDNTstate = getRandomBool();
    }
    else if (message.action === 'get-gpc-state') {
        if (randomizeGPC) {
            sendResponse({ state: randomGPCstate });
        }
        else {
            sendResponse({ state: 'disabled' });
        }
        randomGPCstate = getRandomBool();
    }
});