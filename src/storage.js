const browser = require('webextension-polyfill')

const LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED = 'wublub-xp-enabled'

export async function getWublubState() {
    const state = await browser.storage.local.get(LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED)
    return state && state[LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED]
}

export async function setWublubState(isEnabled) {
    await browser.storage.local.set({
        [LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED]: isEnabled
    })
}
