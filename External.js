
function getIPAddress(callback, errorCallback) {
  var IPUrl = 'https://showextip.azurewebsites.net/'; // Any site used here must be present in manifest.json.
  var thing = new XMLHttpRequest();
  thing.open('GET', IPUrl);
  thing.responseType = 'text';
  thing.onload = function() {
    var response = thing.response;
    if (!response) {
      errorCallback('No response.');
      return;
    }

	var pattern = /\b(([01]?\d?\d|2[0-4]\d|25[0-5])\.){3}([01]?\d?\d|2[0-4]\d|25[0-5])\b/;
	var foundIP = pattern.exec(response);

    callback(foundIP[0]);
  };
  thing.onerror = function() {
    errorCallback('Network error.');
  };
  thing.send();
}

function renderText(statusText) {
	document.getElementById('status').textContent = statusText;
}


document.addEventListener('DOMContentLoaded', function() {

    getIPAddress(function(ipaddress) {

      renderText(ipaddress);

    }, function(errorMessage) {
    });
});
