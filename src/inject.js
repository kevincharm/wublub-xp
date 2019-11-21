import log from './logger'

let initialEditorMode = null
const heuristicIds = ['Solution', 'Test']

log('Inject script loaded.')

window.addEventListener('message', event => {
    const msg = event.data
    switch (msg.kind) {
        case 'wublub-xp-enable':
            stopModeRetries()
            retryMode(loadCppMode)
            break
        case 'wublub-xp-disable':
            stopModeRetries()
            retryMode(resetMode)
            break
    }
})

function loadCppMode() {
    log('Loading ace/mode/c_cpp...')

    for (const heuristicId of heuristicIds) {
        const editorId = document.querySelector(editorSelector(heuristicId)).id
        const editor = ace.edit(editorId)

        if (!initialEditorMode) {
            initialEditorMode = editor.session.getMode()
        }

        editor.session.setMode({
            path: 'ace/mode/c_cpp',
            v: Date.now()
        })
    }
}

function resetMode() {
    log('Resetting mode...')

    if (!initialEditorMode) {
        return
    }

    for (const heuristicId of heuristicIds) {
        const editorId = document.querySelector(editorSelector(heuristicId)).id
        const editor = ace.edit(editorId)

        editor.session.setMode(initialEditorMode)
    }
}

let loadModeTimer = null
function stopModeRetries() {
    clearTimeout(loadModeTimer)
}
function retryMode(fn) {
    // check if it's a page with editors
    const isEditPage = !!heuristicIds.map(id => document.querySelector(editorSelector(id))).filter(e => e).length
    if (!isEditPage) {
        log('No editors on this page...')
        return
    }

    if (typeof ace === 'undefined') {
        // check if ace is loaded
        log('Ace editor not ready yet...')
        if (!loadModeTimer) {
            loadModeTimer = setTimeout(retryMode.bind(this, fn), 1000)
        }
        return
    }

    clearTimeout(loadModeTimer)
    loadModeTimer = null

    fn()
}

function editorSelector(editorId) {
    return `#${editorId} > div > .aceEditor`
}
