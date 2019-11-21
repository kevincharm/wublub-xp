import { getWublubState } from './storage'
const browser = require('webextension-polyfill')

document.addEventListener('DOMContentLoaded', async () => {
    // Only load in top frame
    if (window.self !== window.top) {
        return
    }

    console.log('[wublub-xp] Loaded content script.')

    inject()
    const isEnabled = await getWublubState()
    if (isEnabled) {
        window.postMessage({ kind: 'wublub-xp-enable' })
    } else {
        window.postMessage({ kind: 'wublub-xp-disable' })
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
