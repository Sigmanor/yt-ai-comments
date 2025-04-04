#!/bin/bash

# Script to prepare the extension for Chrome

echo "Preparing extension for Chrome..."

# Check if src directory exists
if [ ! -d "src" ]; then
  echo "Error: 'src' directory not found!"
  exit 1
fi

# Check if manifest-chrome.json exists
if [ ! -f "manifest/manifest-chrome.json" ]; then
  echo "Error: 'manifest/manifest-chrome.json' file not found!"
  exit 1
fi

# Replace manifest.json with the Chrome version
echo "Replacing manifest.json with the Chrome version..."
cp manifest/manifest-chrome.json src/manifest.json

echo "Done! Now you can install the extension in Chrome."
echo "To install in Chrome, go to chrome://extensions/"
echo "enable Developer mode and select 'Load unpacked extension'."
