<div align="center">

# YouTube AI Comments Generator

![alt text](assets/store-screenshots/3.jpg)

[![Build and Release Extension](https://github.com/Sigmanor/yt-ai-comments/actions/workflows/release.yml/badge.svg)](https://github.com/Sigmanor/yt-ai-comments/actions/workflows/release.yml)
[![License: MPL 2.0](https://img.shields.io/badge/License-MPL_2.0-brightgreen.svg)](https://opensource.org/licenses/MPL-2.0)
[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Available-4285F4?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/youtube-ai-comments-gener/ikdjiofmkibkjecaknpmolmibjbkgalo)

YouTube AI Comments Generator is a browser extension that helps you craft engaging and insightful comments for YouTube videos using AI. It supports multiple languages and various AI providers, making it easy to interact with your favorite creators and show your support effortlessly!

</div>

## 🌟 Features

- **AI-Powered Comment Generation**: Utilize OpenAI or MistralAI to create engaging comments
- **Multiple Language Support**: Generate comments in Ukrainian, English, Polish, German, and French
- **Customizable AI Models**: Choose between different models (GPT-4o, Mistral Large, etc.)
- **Adjustable Parameters**: Configure max tokens and temperature for fine-tuned generation
- **Seamless YouTube Integration**: Generate button appears directly in YouTube's comment field
- **Video Context Awareness**: Automatically includes video title in the generation prompt

## 📸 Screenshots

<details>
<summary style="cursor: pointer;">Click to expand</summary>

![Screenshot 1](assets/readme-screenshots/0.png)

![Screenshot 2](assets/readme-screenshots/1.png)

![Screenshot 3](assets/readme-screenshots/2.png)

</details>

## 📋 Requirements

- Chrome (version 88+) or Firefox (version 109+)
- OpenAI or MistralAI API key

## 🔧 Installation

### Chrome Web Store

1. Visit the [Chrome Web Store page](https://chromewebstore.google.com/detail/youtube-ai-comments-gener/ikdjiofmkibkjecaknpmolmibjbkgalo)
2. Click the "Add to Chrome" button
3. Confirm the installation when prompted
4. The extension will be automatically installed and ready to use

### From Releases

1. Go to the [Releases](https://github.com/Sigmanor/yt-ai-comments/releases) page
2. Download the latest version for your browser (`.crx` for Chrome, `.xpi` for Firefox)
   - The Firefox extension is now signed, making installation easier
3. Follow the browser-specific installation instructions below

### Manual Installation

### Chrome

1. Download or clone this repository
2. Run `./scripts/prepare-for-chrome-prod.sh` to set up the Chrome manifest
3. Open Chrome and navigate to `chrome://extensions/`
4. Enable "Developer mode" (toggle in the top right corner)
5. Click "Load unpacked extension"
6. Select the `src` folder of this project

### Firefox

1. Download or clone this repository
2. Run `./scripts/prepare-for-firefox-dev.sh` to set up the Firefox development manifest
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

| Setting              | Description                            | Default                                                                                                                                      |
| -------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Comment Language** | Language for generated comments        | English                                                                                                                                      |
| **AI Provider**      | Choose between OpenAI and MistralAI    | OpenAI                                                                                                                                       |
| **API Key**          | Your API key for the selected provider | -                                                                                                                                            |
| **Model**            | AI model to use for generation         | gpt-4o-mini (OpenAI) or mistral-small-latest (MistralAI)                                                                                     |
| **Max Tokens**       | Maximum length of generated comments   | 2000                                                                                                                                         |
| **Temperature**      | Creativity level (0.0-1.0)             | 0.5                                                                                                                                          |
| **Prompt**           | Template for comment generation        | Write a positive comment to support the YouTube video creator. The comment should be friendly. No less than 10 words, no more than 20 words. |

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
│   ├── manifest-chrome-prod.json
│   ├── manifest-firefox-prod.json
│   └── manifest-firefox-dev.json
├── scripts/                # Build and preparation scripts
│   ├── deploy.sh           # Main deployment script
│   ├── prepare-for-chrome-prod.sh
│   ├── prepare-for-firefox-prod.sh
│   └── prepare-for-firefox-dev.sh
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

2. No dependencies installation is required for local development. The package.json file is only used for the CI/CD pipeline with semantic-release.

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
