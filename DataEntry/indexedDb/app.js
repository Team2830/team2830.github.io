window.onload = function() {
  // Display the scout items.
scoutDB.open(refreshScouts);
    // Get references to the form elements.
var newScoutForm = document.getElementById('new-scout-form');
var newScoutInput = document.getElementById('new-scout');
    
/**
*       Handle new Scout report form submissions.
**/
newScoutForm.onsubmit = function() {
  // Get the scout text.
  var text = newScoutInput.value;

  // Check to make sure the text is not blank (or just spaces).
  if (text.replace(/ /g,'') != '') {
    // Create the scout item.
    scoutDB.createScout(text, function(scout) {
      refreshScouts();
    });
  }

  // Reset the input field.
  newScoutInput.value = '';

  // Don't send the form.
  return false;
};
    // Update the list of scout items.
function refreshScouts() {  
  scoutDB.fetchScouts(function(scouts) {
    var scoutList = document.getElementById('scout-items');
    scoutList.innerHTML = '';

    for(var i = 0; i < scouts.length; i++) {
      // Read the scout items backwards (most recent first).
      var scout = scouts[(scouts.length - 1 - i)];

      var li = document.createElement('li');
      li.id = 'scout-' + scout.timestamp;
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "scout-checkbox";
      checkbox.setAttribute("data-id", scout.timestamp);

      li.appendChild(checkbox);

      var span = document.createElement('span');
      span.innerHTML = scout.text;

      li.appendChild(span);

      scoutList.appendChild(li);

      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        scoutDB.deleteScout(id, refreshScouts);
      });
    }

  });
}
};