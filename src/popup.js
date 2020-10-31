import { error } from './logger'
import { getWublubState, setWublubState } from './storage'
const browser = require('webextension-polyfill')

document.addEventListener('DOMContentLoaded', async () => {
    const button = document.querySelector('#toggle')
    const select = document.querySelector('#mode')

    const state = await getWublubState()
    if (state) {
        button.textContent = 'Disable'
    }

    button.addEventListener('click', async () => {
        const isEnabled = !!(await getWublubState())
        const mode = select.options[select.selectedIndex].value
        if (isEnabled) {
            sendDisable()
        } else {
            sendEnable(mode)
        }
        await setWublubState(!isEnabled, mode)
        button.textContent = isEnabled ? 'Enable' : 'Disable'
    })
})

async function sendEnable(mode) {
    await sendMessage({ kind: 'wublub-xp-enable', mode })
}

async function sendDisable() {
    await sendMessage({ kind: 'wublub-xp-disable' })
}

async function sendMessage(message) {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true })
    await browser.tabs.sendMessage(tabs[0].id, message)
}
