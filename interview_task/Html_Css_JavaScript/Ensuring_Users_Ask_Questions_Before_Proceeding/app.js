const inputsContainer = document.getElementById( "inputs" );
const addBtn = document.getElementById( "addBtn" );
const validateBtn = document.getElementById( "validateBtn" );
const messageArea = document.getElementById( "messageArea" );

let nextIndex = 4; // for placeholder numbers

// Add new input field
addBtn.addEventListener( "click", () =>
{
  const newInput = document.createElement( "input" );
  newInput.type = "text";
  newInput.placeholder = `Question ${ nextIndex }`;
  newInput.name = "q";
  nextIndex++;

  const row = document.createElement( "div" );
  row.classList.add( "row" );
  row.appendChild( newInput );

  inputsContainer.appendChild( row );
} );

// Show message
function showMessage ( text, type )
{
  messageArea.innerHTML = `<div class="${ type }">${ text }</div>`;
}

// Clear all inputs
function clearInputs ()
{
  const allInputs = document.querySelectorAll( "input[name='q']" );
  allInputs.forEach( input => input.value = "" );
}

// Validate questions
validateBtn.addEventListener( "click", () =>
{
  const allInputs = document.querySelectorAll( "input[name='q']" );
  const questions = [];

  allInputs.forEach( input =>
  {
    const value = input.value.trim();
    if ( value !== "" )
    {
      questions.push( value.toLowerCase() );
    }
  } );

  // Must enter 3 questions
  if ( questions.length < 3 )
  {
    showMessage( "Please ask at least 3 questions.", "error" );
    return;
  }

  // Check duplicates
  const noDuplicates = new Set( questions );

  if ( noDuplicates.size !== questions.length )
  {
    clearInputs();
    alert( "Kindly ask different questions. Don't repeat the same question." );
    showMessage( "Duplicate found. All inputs cleared.", "error" );
    return;
  }

  // Success
  showMessage( "Proceed to next module", "success" );
} );
