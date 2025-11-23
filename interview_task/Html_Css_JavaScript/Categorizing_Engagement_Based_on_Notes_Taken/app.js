// Simple, easy-to-read JS for scoring rule and learner classification

// --- DOM elements ---
const noteInput = document.getElementById( 'noteInput' );
const addBtn = document.getElementById( 'addBtn' );
const clearBtn = document.getElementById( 'clearBtn' );
const messageEl = document.getElementById( 'message' );
const scoreEl = document.getElementById( 'score' );
const countEl = document.getElementById( 'count' );
const noteList = document.getElementById( 'noteList' );
const classificationEl = document.getElementById( 'classification' );

// --- Data store (in-memory) ---
let notes = [];

// --- Helpers ---
// Calculate score (no cap): 1 note = 2 points
function calculateScore ( totalNotes )
{
    return totalNotes * 2;
}

// Format date/time for note meta (simple)
function formatTime ( date )
{
    return date.toLocaleString();
}

// Classify learner according to rules:
// Active Learner -> 3 or more notes
// Passive Learner -> 1 or 2 notes
// Needs Encouragement -> 0 notes
function classifyLearner ( total )
{
    if ( total >= 3 ) return { label: 'Active Learner', color: '#10b981' }; // green
    if ( total >= 1 ) return { label: 'Passive Learner', color: '#f59e0b' }; // amber
    return { label: 'Needs Encouragement', color: '#ef4444' }; // red
}

// --- UI update ---
function updateUI ()
{
    const total = notes.length;

    // Score + count
    scoreEl.textContent = `Your current score is ${ calculateScore( total ) }`;
    countEl.textContent = total;

    // Message logic for notes
    if ( total === 0 )
    {
        messageEl.textContent = 'Reminder: Please add notes!';
        messageEl.style.color = '#ef4444'; // red
    } else if ( total === 1 )
    {
        messageEl.textContent = 'At-least 2 notes is compulsory.';
        messageEl.style.color = '#f59e0b'; // amber
    } else
    {
        messageEl.textContent = 'Good — keep it up!';
        messageEl.style.color = '#10b981'; // green
    }

    // Update classification badge
    const classification = classifyLearner( total );
    classificationEl.textContent = classification.label;
    classificationEl.style.background = classification.color;

    // Render notes (newest first)
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

        // delete button
        const delBtn = document.createElement( 'button' );
        delBtn.className = 'action-btn';
        delBtn.title = 'Delete note';
        delBtn.textContent = '🗑';
        delBtn.addEventListener( 'click', function ()
        {
            // remove this note by index (since we rendered reverse, compute index)
            const realIndex = i;
            notes.splice( realIndex, 1 );
            updateUI();
        } );

        actions.appendChild( delBtn );

        li.appendChild( left );
        li.appendChild( actions );
        noteList.appendChild( li );
    }

    // Button states
    addBtn.disabled = noteInput.value.trim() === '';
    clearBtn.disabled = notes.length === 0;
}

// --- Actions ---
function addNote ()
{
    const text = noteInput.value.trim();
    if ( text === '' ) return;

    notes.push( { text: text, time: formatTime( new Date() ) } );
    noteInput.value = '';
    updateUI();
}

function clearAllNotes ()
{
    if ( !confirm( 'Delete all notes?' ) ) return;
    notes = [];
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
