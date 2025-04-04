<div align="center">

# YouTube AI Comments Generator

[![Build and Release Extension](https://github.com/Sigmanor/yt-ai-comments/actions/workflows/release.yml/badge.svg)](https://github.com/Sigmanor/yt-ai-comments/actions/workflows/release.yml)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)

A browser extension for Chrome and Firefox that generates AI-powered comments to support YouTube creators.

</div>

## 🌟 Features

- **AI-Powered Comment Generation**: Utilize OpenAI or MistralAI to create engaging comments
- **Multiple Language Support**: Generate comments in Ukrainian, English, Polish, German, and French
- **Customizable AI Models**: Choose between different models (GPT-4o, Mistral Large, etc.)
- **Adjustable Parameters**: Configure max tokens and temperature for fine-tuned generation
- **Theme Support**: Light, Dark, and System theme options for comfortable usage
- **Seamless YouTube Integration**: Generate button appears directly in YouTube's comment field
- **Video Context Awareness**: Automatically includes video title in the generation prompt

## 📋 Requirements

- Chrome (version 88+) or Firefox (version 109+)
- OpenAI or MistralAI API key

## 🔧 Installation

### From Releases

1. Go to the [Releases](https://github.com/Sigmanor/yt-ai-comments/releases) page
2. Download the latest version for your browser (`.crx` for Chrome, `.xpi` for Firefox)
3. Follow the browser-specific installation instructions below

### Manual Installation

#### Chrome

1. Download or clone this repository
2. Run `./scripts/prepare-for-chrome.sh` to set up the Chrome manifest
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in the top right corner)
5. Click "Load unpacked extension"
6. Select the `src` folder of this project

#### Firefox

1. Download or clone this repository
2. Run `./scripts/prepare-for-firefox.sh` to set up the Firefox manifest
3. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file in the `src` folder

## 🚀 Usage

1. **Set Up the Extension**:
   - Click the extension icon in your browser toolbar
   - Click "More Settings" to access the full settings page
   - Enter your API key (OpenAI or MistralAI)
   - Configure your preferred language, model, and other settings
   - Save your settings

2. **Generate Comments**:
   - Navigate to any YouTube video
   - Click in the comment field
   - The "Generate Comment" button will appear next to YouTube's comment buttons
   - Click the button to generate a comment based on your settings
   - Edit the generated comment if needed
   - Post your comment using YouTube's "Comment" button

## ⚙️ Configuration Options

| Setting | Description | Default |
|---------|-------------|--------|
| **Generation Language** | Language for generated comments | English |
| **AI Provider** | Choose between OpenAI and MistralAI | OpenAI |
| **API Key** | Your API key for the selected provider | - |
| **Model** | AI model to use for generation | gpt-4o-mini (OpenAI) or mistral-small-latest (MistralAI) |
| **Max Tokens** | Maximum length of generated comments | 2000 |
| **Temperature** | Creativity level (0.0-1.0) | 0.5 |
| **Theme** | UI appearance (Light, Dark, or Auto) | Auto (System) |
| **Generation Prompt** | Template for comment generation | Supportive comment template |

## 🔑 Getting API Keys

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into the extension settings

### MistralAI API Key

1. Go to [Mistral AI Console](https://console.mistral.ai/)
2. Create an account or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into the extension settings

## 🛠️ Development

### Project Structure

```
├── manifest/               # Browser-specific manifest files
│   ├── manifest-chrome.json
│   └── manifest-firefox.json
├── scripts/                # Build and preparation scripts
│   ├── deploy.sh           # Main deployment script
│   ├── prepare-for-chrome.sh
│   └── prepare-for-firefox.sh
├── src/                    # Extension source code
│   ├── background.js       # Background service worker
│   ├── content.js          # YouTube page integration
│   ├── options.html/js/css # Settings page
│   ├── popup.html/js/css   # Popup interface
│   ├── themes.css          # Theme styling
│   └── icons/              # Extension icons
└── .github/workflows/      # CI/CD configuration
```

### Building From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/Sigmanor/yt-ai-comments.git
   cd yt-ai-comments
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build extensions for both browsers:
   ```bash
   ./scripts/deploy.sh
   ```
   This will create extension packages in the `dist` directory.

## 📝 License

This project is licensed under the Mozilla Public License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Credits

- Icons used in this extension are created by [Kawalanicon](https://www.flaticon.com/authors/kawalanicon) from Flaticon
- Built with ❤️ for the YouTube community
