chrome.commands.onCommand.addListener((command) => {
  if (command === "read-selection") {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tabId = tabs[0].id;
      
      try {
        const results = await chrome.scripting.executeScript({
          target: { tabId: tabId },
          func: getSelectedText
        });
        
        const selectedText = results[0].result;
        
        if (selectedText && selectedText.trim().length > 0) {
          speakText(selectedText.trim(), tabId);
        } else {
          showMessage(tabId, "Please highlight some text first", "error");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    });
  }
});

function getSelectedText() {
  return window.getSelection().toString();
}

async function speakText(text, tabId) {
  const settings = await chrome.storage.local.get(["apiKey", "voiceId"]);
  const apiKey = settings.apiKey;
  const voiceId = settings.voiceId;
  
  if (!apiKey || !voiceId) {
    showMessage(tabId, "Please set API Key and Voice ID in extension popup", "error");
    return;
  }

  showMessage(tabId, "Generating speech...", "processing");

  try {
    const response = await fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/" + voiceId,
      {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      }
    );

    if (!response.ok) {
      throw new Error("API error: " + response.status);
    }

    const audioBlob = await response.blob();
    const reader = new FileReader();
    
    reader.onloadend = () => {
      playAudioInTab(tabId, reader.result);
    };
    
    reader.readAsDataURL(audioBlob);

  } catch (error) {
    showMessage(tabId, "Failed: " + error.message, "error");
  }
}

function showMessage(tabId, message, type) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: displayNotification,
    args: [message, type]
  });
}

function displayNotification(message, type) {
  const existingNote = document.getElementById("autopage-reader-notification");
  if (existingNote) existingNote.remove();
  
  const note = document.createElement("div");
  note.id = "autopage-reader-notification";
  let bgColor = "#333";
  if (type === "error") bgColor = "#e74c3c";
  if (type === "processing") bgColor = "#3498db";
  if (type === "playing") bgColor = "#27ae60";
  note.style.cssText = "position:fixed;bottom:20px;right:20px;background:" + bgColor + ";color:white;padding:12px 20px;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,0.3);";
  note.textContent = message;
  document.body.appendChild(note);
  if (type === "error") {
    setTimeout(function() { note.remove(); }, 5000);
  }
}

function playAudioInTab(tabId, audioData) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: playAudio,
    args: [audioData]
  });
}

function playAudio(audioData) {
  const existingNote = document.getElementById("autopage-reader-notification");
  if (existingNote) existingNote.remove();
  
  const existingAudio = document.getElementById("autopage-reader-audio");
  if (existingAudio) {
    existingAudio.pause();
    existingAudio.remove();
  }
  
  const audio = new Audio(audioData);
  audio.id = "autopage-reader-audio";
  document.body.appendChild(audio);
  
  const note = document.createElement("div");
  note.id = "autopage-reader-notification";
  note.style.cssText = "position:fixed;bottom:20px;right:20px;background:#27ae60;color:white;padding:12px 20px;border-radius:8px;font-family:Arial,sans-serif;font-size:14px;z-index:2147483647;box-shadow:0 4px 12px rgba(0,0,0,0.3);";
  note.textContent = "Playing...";
  document.body.appendChild(note);
  
  audio.play();
  
  audio.onended = function() {
    note.remove();
    audio.remove();
  };
  
  audio.onerror = function() {
    note.textContent = "Error playing audio";
    note.style.background = "#e74c3c";
    setTimeout(function() { note.remove(); }, 5000);
    audio.remove();
  };
}
