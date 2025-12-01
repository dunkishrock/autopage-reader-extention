# Autopage Reader

**AI-Powered Text-to-Speech Browser Extension**

Highlight any text on a webpage and hear it read aloud instantly using ElevenLabs AI voice synthesis.

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![Platform](https://img.shields.io/badge/platform-Chrome%20%7C%20Edge%20%7C%20Brave-green)

## Features

- 🎯 **Simple to use**: Highlight text → Press Ctrl+Shift+S → Listen
- 🔊 **High-quality voices**: Powered by ElevenLabs AI
- ⏯️ **Playback controls**: Play, Pause, Stop buttons
- ⏱️ **Time display**: See current position and duration
- ⚡ **Fast**: Turbo model for quick response
- 🔒 **Private**: Your API key stored locally

## Folder Structure

After downloading files from GitHub, organize them like this:

```
autopage-reader/
├── manifest.json
├── background.js
├── popup.html
├── popup.js
└── icons/
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

**Important:** The `icons` folder must be inside the main extension folder, and all three icon sizes are required.

## Installation

### From Source (Developer Mode)

1. Download all files from this repository
2. Create a folder named `autopage-reader` on your computer
3. Place the files inside following the folder structure above
4. Create an `icons` subfolder and place the icon files inside it
5. Open Chrome and go to `chrome://extensions`
6. Enable **Developer mode** (top right toggle)
7. Click **Load unpacked**
8. Select the `autopage-reader` folder

### Setup

1. Get your API Key from [ElevenLabs](https://elevenlabs.io)
2. Get a Voice ID from your ElevenLabs dashboard
3. Click the Autopage Reader icon in Chrome toolbar
4. Enter your API Key and Voice ID
5. Click **Save Settings**

## Usage

1. Navigate to any webpage
2. Highlight the text you want to hear
3. Press **Ctrl+Shift+S** (or **Cmd+Shift+S** on Mac)
4. Use the playback controls:
   - **⏸ / ▶** - Pause or Resume
   - **⏹** - Stop playback
   - **✕** - Close player

## Keyboard Shortcut

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Read selected text | Ctrl+Shift+S | Cmd+Shift+S |

### ⚠️ Shortcut Not Working?

Sometimes Chrome doesn't automatically assign the keyboard shortcut. To set it manually:

1. Go to `chrome://extensions/shortcuts`
2. Find **Autopage Reader**
3. Click the pencil icon (✏️) next to **"Read selected text aloud"**
4. Press **Ctrl+Shift+S** (or your preferred shortcut)
5. Make sure the dropdown says **"In Chrome"**

**Common reasons the shortcut may not auto-assign:**
- Another extension is using the same shortcut
- System software (Windows, Dell, etc.) has reserved the shortcut
- Chrome bug with unpacked/developer extensions

Once set manually, the shortcut persists across Chrome restarts.

## Files

| File | Purpose |
|------|---------|
| manifest.json | Extension configuration |
| background.js | Core logic, API calls, playback controls |
| popup.html | Settings interface |
| popup.js | Settings save/load |
| icons/icon-16.png | Toolbar icon (16x16) |
| icons/icon-48.png | Extension page icon (48x48) |
| icons/icon-128.png | Chrome Web Store icon (128x128) |

## Requirements

- Google Chrome, Microsoft Edge, or Brave browser
- ElevenLabs account with API access
- Active internet connection

## Troubleshooting

### Extension won't load?
- Ensure all files are in the correct folder structure
- Check that the `icons` folder exists with all 3 icon files
- Verify JSON syntax in manifest.json

### Keyboard shortcut doesn't work?
- Set it manually at `chrome://extensions/shortcuts` (see instructions above)
- Try a different shortcut if there's a conflict
- Make sure you're on a regular webpage (not chrome:// pages)

### Settings won't save?
- Reload the extension from chrome://extensions
- Check browser console for errors (F12 → Console)

### "Error playing audio" message?
- Click anywhere on the webpage first (enables audio permissions)
- Try again with Ctrl+Shift+S
- Check your ElevenLabs API quota

### No audio plays?
- Verify your API key is correct
- Check your ElevenLabs quota hasn't been exceeded
- Ensure Voice ID exists in your account

## Privacy

- Your API key is stored locally in your browser
- Text is sent to ElevenLabs for processing
- No data is collected or stored by this extension

## Version History

- **1.2.0** - Added playback controls (Play/Pause/Stop), time display
- **1.1.0** - Added custom branding and icons
- **1.0.0** - Initial release

## License

MIT License - Free to use and modify

## Author

Built by Duncan Onyemuwa

---

**Found a bug or have a feature request?** Open an issue on GitHub!
