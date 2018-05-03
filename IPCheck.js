
getLocalIPs(function(ips) { // <!-- ips is an array of local IP addresses.
    //document.body.textContent = 'Local IP addresses:\n ' + ips.join('\n ');
    document.getElementById('local').textContent = ips;
});

function getLocalIPs(callback) {
    var ips = [];

    var RTCPeerConnection = window.RTCPeerConnection ||
        window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

    var pc = new RTCPeerConnection({
        // Don't specify any stun/turn servers, otherwise you will
        // also find your public IP addresses.
        iceServers: []
    });
    // Add a media line, this is needed to activate candidate gathering.
    pc.createDataChannel('');

    // onicecandidate is triggered whenever a candidate has been found.
    pc.onicecandidate = function(e) {
        if (!e.candidate) { // Candidate gathering completed.
            pc.close();
            callback(ips);
            return;
        }
        var ip = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];
        if (ips.indexOf(ip) == -1) // avoid duplicate entries (tcp/udp)
            ips.push(ip);
    };
    pc.createOffer(function(sdp) {
        pc.setLocalDescription(sdp);
    }, function onerror() {});
}

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

if( statusText != '50.235.191.182') {
return;
}
