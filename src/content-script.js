document.addEventListener('DOMContentLoaded', () => {
    // Only load in top frame
    if (window.self !== window.top) {
        return
    }

    console.log('[wublub-xp] Loaded content script.')

    inject()
})

function inject() {
    const script = document.createElement('script')
    script.src = browser.extension.getURL('/inject.js')
    document.body.appendChild(script)
}
