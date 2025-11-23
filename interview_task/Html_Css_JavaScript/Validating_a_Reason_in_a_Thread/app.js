// Simple validator for "Reason" with up to 3 attempts.
// Rules:
// 1) Reason must have at least 5 words.
// 2) Reason must contain one of: "because", "so", "therefore" (case-insensitive).
// 3) Student has 3 attempts. Use a loop-like flow via attempts counter.

// DOM elements
const reasonInput = document.getElementById( 'reason' );
const submitBtn = document.getElementById( 'submitBtn' );
const resetBtn = document.getElementById( 'resetBtn' );
const statusEl = document.getElementById( 'status' );
const attemptsEl = document.getElementById( 'attempts' );

// Attempts counter (3 chances)
let attemptsLeft = 3;

// Helper: count words (simple, ignores extra spaces)
function wordCount ( text )
{
    // split by whitespace and remove empty items
    return text.trim().split( /\s+/ ).filter( Boolean ).length;
}

// Helper: check for required keywords
function hasKeyword ( text )
{
    // word boundary regex, case-insensitive
    const re = /\b(because|so|therefore)\b/i;
    return re.test( text );
}

// The validation check
function validateReason ( text )
{
    const words = wordCount( text );
    const keyword = hasKeyword( text );

    if ( words < 5 )
    {
        return { ok: false, reason: 'The reason must contain at least 5 words.' };
    }
    if ( !keyword )
    {
        return { ok: false, reason: 'The reason must include "because", "so" or "therefore".' };
    }
    return { ok: true };
}

// Update UI helper
function updateAttemptsUI ()
{
    attemptsEl.textContent = attemptsLeft;
}

// Action: handle submit
submitBtn.addEventListener( 'click', function ()
{
    // If no attempts left, do nothing
    if ( attemptsLeft <= 0 )
    {
        statusEl.textContent = 'No attempts left. Submission failed.';
        statusEl.className = 'status bad';
        return;
    }

    const text = reasonInput.value;

    const result = validateReason( text );

    if ( result.ok )
    {
        // Accepted
        statusEl.textContent = 'Accepted';
        statusEl.className = 'status ok';
        // disable submit to prevent more attempts
        submitBtn.disabled = true;
        reasonInput.disabled = true;
    } else
    {
        // Invalid -> decrement attempts and ask to try again
        attemptsLeft -= 1;
        updateAttemptsUI();

        if ( attemptsLeft > 0 )
        {
            statusEl.textContent = 'Try again — ' + result.reason;
            statusEl.className = 'status try';
        } else
        {
            // No attempts left
            statusEl.textContent = 'No attempts left. Submission failed.';
            statusEl.className = 'status bad';
            // optionally disable input and submit
            submitBtn.disabled = true;
            reasonInput.disabled = true;
        }
    }
} );

// Reset attempts (for testing/demo)
resetBtn.addEventListener( 'click', function ()
{
    attemptsLeft = 3;
    updateAttemptsUI();
    statusEl.textContent = '';
    statusEl.className = 'status';
    submitBtn.disabled = false;
    reasonInput.disabled = false;
    reasonInput.value = '';
} );

// initialize UI
updateAttemptsUI();
statusEl.textContent = '';
