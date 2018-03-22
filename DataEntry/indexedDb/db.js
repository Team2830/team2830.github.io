var scoutDB = (function() {
  var tDB = {};
  var datastore = null;

/**
 * Open a connection to the datastore.
 */
tDB.open = function(callback) {
  // Database version.
  var version = 1;

  // Open a connection to the datastore.
  var request = indexedDB.open('scouts', version);

  // Handle datastore upgrades.
  request.onupgradeneeded = function(e) {
    var db = e.target.result;

    e.target.transaction.onerror = tDB.onerror;

    // Delete the old datastore.
    if (db.objectStoreNames.contains('scout')) {
      db.deleteObjectStore('scout');
    }

    // Create a new datastore.
    var store = db.createObjectStore('scout', {
      keyPath: 'timestamp'
    });
  };

  // Handle successful datastore access.
  request.onsuccess = function(e) {
    // Get a reference to the DB.
    datastore = e.target.result;

    // Execute the callback.
    callback();
  };

  // Handle errors when opening the datastore.
  request.onerror = tDB.onerror;
};
    
    /**
 * Fetch all of the scout items in the datastore.
 */
tDB.fetchScouts = function(callback) {
  var db = datastore;
  var transaction = db.transaction(['scout'], 'readwrite');
  var objStore = transaction.objectStore('scout');

  var keyRange = IDBKeyRange.lowerBound(0);
  var cursorRequest = objStore.openCursor(keyRange);

  var scouts = [];

  transaction.oncomplete = function(e) {
    // Execute the callback function.
    callback(scouts);
  };

  cursorRequest.onsuccess = function(e) {
    var result = e.target.result;

    if (!!result == false) {
      return;
    }

    scouts.push(result.value);

    result.continue();
  };

  cursorRequest.onerror = tDB.onerror;
};
    /**
 * Create a new scout item.
 */
tDB.createScout = function(text, callback) {
  // Get a reference to the db.
  var db = datastore;

  // Initiate a new transaction.
  var transaction = db.transaction(['scout'], 'readwrite');

  // Get the datastore.
  var objStore = transaction.objectStore('scout');

  // Create a timestamp for the scout item.
  var timestamp = new Date().getTime();

  // Create an object for the scout item.
  var scout = {
    'text': text,
    'timestamp': timestamp
  };

  // Create the datastore request.
  var request = objStore.put(scout);

  // Handle a successful datastore put.
  request.onsuccess = function(e) {
    // Execute the callback function.
    callback(scout);
  };

  // Handle errors.
  request.onerror = tDB.onerror;
};
    /**
 * Delete a scout item.
 */
tDB.deleteScout = function(id, callback) {
  var db = datastore;
  var transaction = db.transaction(['scout'], 'readwrite');
  var objStore = transaction.objectStore('scout');

  var request = objStore.delete(id);

  request.onsuccess = function(e) {
    callback();
  }

  request.onerror = function(e) {
    console.log(e);
  }
};
    
  // Export the tDB object.
  return tDB;
}());