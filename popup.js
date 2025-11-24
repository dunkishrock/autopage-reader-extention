chrome.storage.local.get(["apiKey", "voiceId"], function(result) {
  if (result.apiKey) document.getElementById("apiKey").value = result.apiKey;
  if (result.voiceId) document.getElementById("voiceId").value = result.voiceId;
});

document.getElementById("saveBtn").onclick = function() {
  var apiKey = document.getElementById("apiKey").value.trim();
  var voiceId = document.getElementById("voiceId").value.trim();
  var status = document.getElementById("status");
  
  if (!apiKey || !voiceId) {
    status.textContent = "Please fill in both fields";
    status.style.background = "#e74c3c";
    return;
  }
  
  chrome.storage.local.set({ apiKey: apiKey, voiceId: voiceId }, function() {
    status.textContent = "Settings saved!";
    status.style.background = "#27ae60";
  });
};
