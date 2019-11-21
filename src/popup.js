import { error } from './logger'
import { getWublubState, setWublubState } from './storage'
const browser = require('webextension-polyfill')

document.addEventListener('DOMContentLoaded', async () => {
    const button = document.querySelector('#toggle')
    const isEnabled = await getWublubState()
    if (isEnabled) {
        button.textContent = 'Disable'
    }

    button.addEventListener('click', async () => {
        const isEnabled = !!(await getWublubState())
        if (isEnabled) {
            sendDisable()
        } else {
            sendEnable()
        }
        await setWublubState(!isEnabled)
        button.textContent = isEnabled ? 'Enable' : 'Disable'
    })
})

async function sendEnable() {
    await sendMessage({ kind: 'wublub-xp-enable' })
}

async function sendDisable() {
    await sendMessage({ kind: 'wublub-xp-disable' })
}

async function sendMessage(message) {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    await browser.tabs.sendMessage(tabs[0].id, message)
}
