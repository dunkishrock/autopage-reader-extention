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
    func: playAudioWithControls,
    args: [audioData]
  });
}

function playAudioWithControls(audioData) {
  // Remove any existing notification
  const existingNote = document.getElementById("autopage-reader-notification");
  if (existingNote) existingNote.remove();
  
  // Remove any existing player
  const existingPlayer = document.getElementById("autopage-reader-player");
  if (existingPlayer) existingPlayer.remove();
  
  // Remove any existing audio
  const existingAudio = document.getElementById("autopage-reader-audio");
  if (existingAudio) {
    existingAudio.pause();
    existingAudio.remove();
  }
  
  // Create audio element
  const audio = new Audio(audioData);
  audio.id = "autopage-reader-audio";
  document.body.appendChild(audio);
  
  // Create player UI
  const player = document.createElement("div");
  player.id = "autopage-reader-player";
  player.style.cssText = "position:fixed;bottom:20px;right:20px;background:#1a1a2e;color:white;padding:12px 16px;border-radius:12px;font-family:Arial,sans-serif;font-size:14px;z-index:2147483647;box-shadow:0 4px 20px rgba(0,0,0,0.4);display:flex;align-items:center;gap:12px;";
  
  // Status indicator
  const status = document.createElement("div");
  status.id = "autopage-reader-status";
  status.style.cssText = "width:8px;height:8px;border-radius:50%;background:#27ae60;";
  player.appendChild(status);
  
  // Play/Pause button
  const playPauseBtn = document.createElement("button");
  playPauseBtn.id = "autopage-reader-playpause";
  playPauseBtn.innerHTML = "⏸";
  playPauseBtn.title = "Pause";
  playPauseBtn.style.cssText = "background:#4a90d9;border:none;color:white;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;";
  player.appendChild(playPauseBtn);
  
  // Stop button
  const stopBtn = document.createElement("button");
  stopBtn.id = "autopage-reader-stop";
  stopBtn.innerHTML = "⏹";
  stopBtn.title = "Stop";
  stopBtn.style.cssText = "background:#e74c3c;border:none;color:white;width:36px;height:36px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;";
  player.appendChild(stopBtn);
  
  // Time display
  const timeDisplay = document.createElement("span");
  timeDisplay.id = "autopage-reader-time";
  timeDisplay.style.cssText = "font-size:12px;color:#aaa;min-width:70px;";
  timeDisplay.textContent = "0:00 / 0:00";
  player.appendChild(timeDisplay);
  
  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "✕";
  closeBtn.title = "Close";
  closeBtn.style.cssText = "background:transparent;border:none;color:#888;cursor:pointer;font-size:14px;padding:4px;margin-left:4px;";
  player.appendChild(closeBtn);
  
  document.body.appendChild(player);
  
  // Format time helper
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return mins + ":" + (secs < 10 ? "0" : "") + secs;
  }
  
  // Update time display
  audio.ontimeupdate = function() {
    const current = formatTime(audio.currentTime);
    const total = formatTime(audio.duration || 0);
    timeDisplay.textContent = current + " / " + total;
  };
  
  // Play/Pause functionality
  let isPlaying = true;
  playPauseBtn.onclick = function() {
    if (isPlaying) {
      audio.pause();
      playPauseBtn.innerHTML = "▶";
      playPauseBtn.title = "Play";
      status.style.background = "#f39c12";
    } else {
      audio.play();
      playPauseBtn.innerHTML = "⏸";
      playPauseBtn.title = "Pause";
      status.style.background = "#27ae60";
    }
    isPlaying = !isPlaying;
  };
  
  // Stop functionality
  stopBtn.onclick = function() {
    audio.pause();
    audio.currentTime = 0;
    audio.remove();
    player.remove();
  };
  
  // Close button
  closeBtn.onclick = function() {
    audio.pause();
    audio.remove();
    player.remove();
  };
  
  // When audio ends
  audio.onended = function() {
    status.style.background = "#888";
    playPauseBtn.innerHTML = "▶";
    playPauseBtn.title = "Play";
    isPlaying = false;
    setTimeout(function() {
      player.remove();
      audio.remove();
    }, 3000);
  };
  
  // Handle errors
  audio.onerror = function() {
    status.style.background = "#e74c3c";
    timeDisplay.textContent = "Error";
    setTimeout(function() {
      player.remove();
      audio.remove();
    }, 3000);
  };
  
  // Start playing
  audio.play();
}
