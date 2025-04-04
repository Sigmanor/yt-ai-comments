# YouTube AI Comments Generator

A browser extension for Chrome and Firefox that allows you to generate comments to support YouTube creators.

## Features

- Comment generation using AI (OpenAI or MistralAI)
- Customizable generation language
- Customizable generation prompt
- Convenient generation button next to the YouTube comment field

## Installation

### Chrome

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right corner)
4. Click "Load unpacked extension"
5. Select the `src` folder of this project
6. The extension will be installed and appear in the browser toolbar

### Firefox

1. Download or clone this repository
2. Rename the file `src/manifest-firefox.json` to `src/manifest.json` (replace the original file)
3. Open Firefox and go to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on"
5. Select the `manifest.json` file in the `src` folder of this project
6. The extension will be installed temporarily (until Firefox is restarted)

## Settings

1. Click on the extension icon in the browser toolbar
2. Click the "Settings" button
3. Enter your API key for OpenAI or MistralAI
4. Select the comment generation language
5. Customize the generation prompt
6. Click "Save"

## Usage

1. Go to any YouTube video
2. Find the comment field
3. Click the "Generate Comment" button next to the comment field
4. The generated comment will be automatically inserted into the comment field
5. Edit the comment if needed before publishing
6. Publish the comment by clicking the "Comment" button on YouTube

## Getting API Keys

### OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account or log in
3. Go to the API Keys section
4. Create a new API key
5. Copy the key and paste it into the extension settings

### MistralAI API Key

1. Go to [Mistral AI Platform](https://console.mistral.ai/)
2. Create an account or log in
3. Go to the API Keys section
4. Create a new API key
5. Copy the key and paste it into the extension settings

## Credits

- Icons used in this extension are created by [Kawalanicon](https://www.flaticon.com/authors/kawalanicon) from Flaticon
