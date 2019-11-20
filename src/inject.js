console.log('[wublub-xp] Inject script loaded.')

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCppMode)
} else {
    loadCppMode()
}

function loadCppMode() {
    console.log('[wublub-xp] Loading ace/mode/c_cpp...')

    const heuristicIds = ['Solution', 'Test']
    // check if it's a page with editors
    const isEditPage = !!heuristicIds.map(id => document.querySelector(editorSelector(id))).filter(e => e).length
    if (!isEditPage) {
        console.log('wublub-xp] No editors on this page...')
        return
    }

    if (typeof ace === 'undefined') {
        // check if ace is loaded
        console.log('Ace editor not ready yet...')
        setTimeout(loadCppMode, 1000)
        return
    }

    for (const heuristicId of heuristicIds) {
        const editorId = document.querySelector(editorSelector(heuristicId)).id
        const editor = ace.edit(editorId)
        editor.session.setMode({
            path: 'ace/mode/c_cpp',
            v: Date.now()
        })
    }
}

function editorSelector(editorId) {
    return `#${editorId} > div > .aceEditor`
}
