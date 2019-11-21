import log, { error } from './logger'
const browser = require('webextension-polyfill')

const LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED = 'wublub-xp-enabled'

export async function getWublubState() {
    const course = await getCourse()
    if (!course) {
        error('Could not retrieve course!')
    }

    const state = await browser.storage.local.get(LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED)
    return (
        state && state[LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED] && state[LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED].includes(course)
    )
}

export async function setWublubState(isEnabled) {
    const course = await getCourse()
    if (!course) {
        error('Could not retrieve course!')
    }

    let state = await browser.storage.local.get(LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED)
    if (!state || !state[LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED]) {
        state = {
            [LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED]: []
        }
    }

    let courseArr = state[LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED]
    if (isEnabled && !courseArr.includes(course)) {
        courseArr.push(course)
    } else {
        courseArr = courseArr.filter(c => c !== course)
    }

    await browser.storage.local.set({
        [LOCAL_STORAGE_WUBLUB_XP_IS_ENABLED]: courseArr
    })
}

/**
 * This works for both content script (no browser.tabs API)
 * and popup script.
 */
async function getCourse() {
    let location
    if (typeof browser !== 'undefined' && typeof browser.tabs !== 'undefined') {
        const tabs = await browser.tabs.query({ active: true, currentWindow: true })
        const tab = tabs[0]
        if (!tab) {
            return null
        }

        location = new URL(tab.url)
    } else {
        location = new URL(window.location.href)
    }
    const dirs = location.pathname.split('/').filter(d => d)
    if (!dirs.length) {
        return null
    }

    const course = dirs[0]
    return course
}
