#!/bin/bash

# Script to prepare the extension for Firefox

echo "Preparing extension for Firefox..."

# Check if src directory exists
if [ ! -d "src" ]; then
  echo "Error: 'src' directory not found!"
  exit 1
fi

# Check if manifest-firefox.json exists
if [ ! -f "manifest/manifest-firefox.json" ]; then
  echo "Error: 'manifest/manifest-firefox.json' file not found!"
  exit 1
fi

# Create a backup of the original manifest.json if it doesn't exist yet
if [ -f "src/manifest.json" ] && [ ! -f "manifest/manifest-chrome.json" ]; then
  echo "Creating backup of the original manifest.json..."
  cp src/manifest.json manifest/manifest-chrome.json
fi

# Replace manifest.json with the Firefox version
echo "Replacing manifest.json with the Firefox version..."
cp manifest/manifest-firefox.json src/manifest.json

echo "Done! Now you can install the extension in Firefox."
echo "To install in Firefox, go to about:debugging#/runtime/this-firefox"
echo "and select the manifest.json file in the src folder."
echo "Note: The extension now has a permanent ID to enable storage functionality."
