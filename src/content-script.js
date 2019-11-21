import { getWublubState } from './storage'
import log from './logger'
const browser = require('webextension-polyfill')

document.addEventListener('DOMContentLoaded', async () => {
    // Only load in top frame
    if (window.self !== window.top) {
        return
    }

    log('Loaded content script.')

    inject()
    await sendState()
})

async function sendState() {
    const isEnabled = await getWublubState()
    if (isEnabled) {
        window.postMessage({ kind: 'wublub-xp-enable' })
    } else {
        window.postMessage({ kind: 'wublub-xp-disable' })
    }
}

window.addEventListener('message', async event => {
    const message = event.data
    if (!message) {
        return
    }

    if (message.kind === 'wublub-xp-request-state') {
        await sendState()
    }
})

// relay messages to injected script
browser.runtime.onMessage.addListener(message => {
    window.postMessage(message, '*')
})

function inject() {
    const script = document.createElement('script')
    script.src = browser.extension.getURL('/inject.js')
    document.body.appendChild(script)
}
