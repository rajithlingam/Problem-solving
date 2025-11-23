// app.js (fixed Clear All behavior)
// Thread rules + scoring + classification + duplicate protection
// Keeps the same style as your app

// --- DOM elements ---
const noteInput = document.getElementById( 'noteInput' );
const addBtn = document.getElementById( 'addBtn' );
const clearBtn = document.getElementById( 'clearBtn' ); // ensure this exists in HTML
const messageEl = document.getElementById( 'message' );
const scoreEl = document.getElementById( 'score' );
const countEl = document.getElementById( 'count' );
const noteList = document.getElementById( 'noteList' );
const classificationEl = document.getElementById( 'classification' );

const MAX_UNIQUE = 3; // max unique notes per thread

// --- Data store (in-memory) ---
let notes = [];

// --- Helpers ---
function calculateScore ( totalNotes )
{
    return totalNotes * 2;
}

function formatTime ( date )
{
    return date.toLocaleString();
}

function classifyLearner ( total )
{
    if ( total >= 3 ) return { label: 'Active Learner', color: '#10b981' }; // green
    if ( total >= 1 ) return { label: 'Passive Learner', color: '#f59e0b' }; // amber
    return { label: 'Needs Encouragement', color: '#ef4444' }; // red
}

function isDuplicate ( text )
{
    const t = text.trim().toLowerCase();
    for ( let i = 0; i < notes.length; i++ )
    {
        if ( notes[ i ].text.trim().toLowerCase() === t ) return true;
    }
    return false;
}

// --- UI update ---
function updateUI ()
{
    const total = notes.length;

    // Score + count
    scoreEl.textContent = `Your current score is ${ calculateScore( total ) }`;
    countEl.textContent = total;

    // Message logic
    if ( total === 0 )
    {
        messageEl.textContent = 'Reminder: Please add notes!';
        messageEl.className = 'message';
        messageEl.style.color = '#ef4444';
    } else if ( total === 1 )
    {
        messageEl.textContent = 'At-least 2 notes is compulsory.';
        messageEl.className = 'message warn';
        messageEl.style.color = '#f59e0b';
    } else
    {
        messageEl.textContent = 'Good — keep it up!';
        messageEl.className = 'message ok';
        messageEl.style.color = '#10b981';
    }

    // Update classification badge
    const classification = classifyLearner( total );
    classificationEl.textContent = classification.label;
    classificationEl.style.background = classification.color;

    // Render notes newest-first
    noteList.innerHTML = '';
    for ( let i = notes.length - 1; i >= 0; i-- )
    {
        const n = notes[ i ];
        const li = document.createElement( 'li' );
        li.className = 'note-item';

        const left = document.createElement( 'div' );
        left.style.flex = '1';

        const textDiv = document.createElement( 'div' );
        textDiv.className = 'note-text';
        textDiv.textContent = n.text;

        const meta = document.createElement( 'div' );
        meta.className = 'note-meta';
        meta.textContent = `Added: ${ n.time }`;

        left.appendChild( textDiv );
        left.appendChild( meta );

        const actions = document.createElement( 'div' );
        actions.className = 'note-actions';

        const delBtn = document.createElement( 'button' );
        delBtn.className = 'action-btn';
        delBtn.title = 'Delete note';
        delBtn.textContent = '🗑';
        // compute real index (we push at end, render reverse)
        delBtn.addEventListener( 'click', ( function ( idx )
        {
            return function ()
            {
                // idx here is the reverse-rendered index i; real index = idx
                notes.splice( idx, 1 );
                messageEl.textContent = 'Note deleted. You can add another unique note.';
                messageEl.style.color = '#2563eb';
                updateUI();
            };
        } )( i ) );

        actions.appendChild( delBtn );

        li.appendChild( left );
        li.appendChild( actions );
        noteList.appendChild( li );
    }

    // Thread full handling
    if ( notes.length >= MAX_UNIQUE )
    {
        addBtn.disabled = true;
        messageEl.textContent = `Thread full — you can add up to ${ MAX_UNIQUE } unique notes only.`;
        messageEl.style.color = '#ef4444';
    } else
    {
        // enable/disable add based on textarea content
        addBtn.disabled = noteInput.value.trim() === '';
    }

    // Clear button enabled when there is anything to clear
    clearBtn.disabled = notes.length === 0;
}

// --- Actions ---
function addNote ()
{
    const raw = noteInput.value.trim();
    if ( raw === '' ) return;

    if ( notes.length >= MAX_UNIQUE )
    {
        messageEl.textContent = `Thread full — max ${ MAX_UNIQUE } unique notes. Delete one to add another.`;
        messageEl.style.color = '#ef4444';
        addBtn.disabled = true;
        return;
    }

    if ( isDuplicate( raw ) )
    {
        messageEl.textContent = 'Error: You already posted the same note. Please enter a new note.';
        messageEl.style.color = '#ef4444';
        return;
    }

    notes.push( { text: raw, time: formatTime( new Date() ) } );
    noteInput.value = '';
    messageEl.textContent = 'Note added.';
    messageEl.style.color = '#10b981';
    updateUI();
}

function clearAllNotes ()
{
    // If you prefer confirm, keep the confirm; otherwise it will always clear.
    const ok = confirm( 'Delete all notes?' );
    if ( !ok )
    {
        // user cancelled; do nothing
        return;
    }

    // Reset notes and update UI
    notes = [];
    // Reset message and other UI pieces
    messageEl.textContent = 'All notes cleared.';
    messageEl.style.color = '#2563eb';
    // Ensure add button state is correct (updateUI will handle)
    updateUI();
}

// --- Events ---
addBtn.addEventListener( 'click', addNote );
clearBtn.addEventListener( 'click', clearAllNotes );
noteInput.addEventListener( 'input', updateUI );

// allow Ctrl/Cmd+Enter to add quickly
noteInput.addEventListener( 'keydown', function ( e )
{
    if ( ( e.ctrlKey || e.metaKey ) && e.key === 'Enter' )
    {
        addNote();
    }
} );

// initial render
updateUI();
