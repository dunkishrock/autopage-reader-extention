# Autopage Reader

**AI-Powered Text-to-Speech Browser Extension**

Highlight any text on a webpage and hear it read aloud instantly using ElevenLabs AI voice synthesis.

## Features

- 🎯 **Simple to use**: Highlight text → Press Ctrl+Shift+S → Listen
- 🔊 **High-quality voices**: Powered by ElevenLabs AI
- ⚡ **Fast**: Turbo model for quick response
- 🔒 **Private**: Your API key stored locally

## Installation

### From Source (Developer Mode)

1. Download and extract this folder
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top right toggle)
4. Click **Load unpacked**
5. Select the `autopage-reader-extension` folder

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
4. Listen to the AI-generated speech!

## Keyboard Shortcut

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Read selected text | Ctrl+Shift+S | Cmd+Shift+S |

## Files

| File | Purpose |
|------|---------|
| manifest.json | Extension configuration |
| background.js | Core logic and API calls |
| popup.html | Settings interface |
| popup.js | Settings save/load |
| icons/ | Extension icons |

## Requirements

- Google Chrome, Microsoft Edge, or Brave browser
- ElevenLabs account with API access
- Active internet connection

## Troubleshooting

**Extension won't load?**
- Ensure all files are in the correct folder structure
- Check for JSON syntax errors in manifest.json

**Settings won't save?**
- Reload the extension from chrome://extensions

**No audio playing?**
- Verify your API key is correct
- Check your ElevenLabs quota
- Ensure Voice ID exists in your account

## Privacy

- Your API key is stored locally in your browser
- Text is sent to ElevenLabs for processing
- No data is collected or stored by this extension

## License

MIT License - Free to use and modify

## Version History

- **1.0.0** - Initial release
