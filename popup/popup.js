const dntButton = document.getElementById('toggle-dnt');
const gpcButton = document.getElementById('toggle-gpc');

async function getDNTState() {
    const dntState = await browser.storage.local.get('DNT');
    return dntState;
}
async function setDNTState(state) {
    if (state == true) {
        dntButton.classList.remove('off');
        dntButton.classList.add('on');
        dntButton.textContent = 'Randomize DNT: ON';
        await browser.storage.local.set({ 'DNT': true });
    }
    else {
        dntButton.classList.remove('on');
        dntButton.classList.add('off');
        dntButton.textContent = 'Randomize DNT: OFF';
        await browser.storage.local.set({ 'DNT': false });
    }
}
async function toggleDNTState() {
    const dntState = await getDNTState();
    await browser.runtime.sendMessage({ action: 'toggle-dnt' });
    await setDNTState(!dntState.DNT)
}

async function getGPCState() {
    const dntState = await browser.storage.local.get('GPC');
    return dntState;
}
async function setGPCState(state) {
    if (state == true) {
        gpcButton.classList.remove('off');
        gpcButton.classList.add('on');
        gpcButton.textContent = 'Randomize GPC: ON';
        await browser.storage.local.set({ 'GPC': true });
    }
    else {
        gpcButton.classList.remove('on');
        gpcButton.classList.add('off');
        gpcButton.textContent = 'Randomize GPC: OFF';
        await browser.storage.local.set({ 'GPC': false });
    }
}
async function toggleGPCState() {
    const dntState = await getGPCState();
    await browser.runtime.sendMessage({ action: 'toggle-gpc' });
    await setGPCState(!dntState.GPC);
}

async function setButtonStates() {
    const DNTState = await getDNTState();
    const GPCState = await getGPCState();

    if (DNTState.DNT === undefined) {
        await setDNTState(true);
    }
    else {
        await setDNTState(DNTState.DNT);
    }

    if (GPCState.GPC === undefined) {
        await setGPCState(true);
    }
    else {
        await setGPCState(GPCState.GPC);
    }
}

dntButton.addEventListener('click', function() {
  toggleDNTState();
});

gpcButton.addEventListener('click', function() {
  toggleGPCState();
});

setButtonStates();
  