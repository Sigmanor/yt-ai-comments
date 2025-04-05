#!/bin/bash

# Script to prepare the extension for Firefox development

echo "Preparing extension for Firefox development..."

# Check if src directory exists
if [ ! -d "src" ]; then
  echo "Error: 'src' directory not found!"
  exit 1
fi

# Check if manifest-firefox-dev.json exists
if [ ! -f "manifest/manifest-firefox-dev.json" ]; then
  echo "Error: 'manifest/manifest-firefox-dev.json' file not found!"
  exit 1
fi

# Replace manifest.json with the Firefox development version
echo "Replacing manifest.json with the Firefox development version..."
cp manifest/manifest-firefox-dev.json src/manifest.json

echo "Done! Now you can install the development version of the extension in Firefox."
echo "To install in Firefox, go to about:debugging#/runtime/this-firefox"
echo "and select the manifest.json file in the src folder."