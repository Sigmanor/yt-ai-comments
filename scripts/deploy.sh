#!/bin/bash

# Script to create extension packages for Firefox and Chrome

echo "Starting deployment process..."

# Create dist directory if it doesn't exist
mkdir -p dist

# Prepare Firefox version
echo "Preparing Firefox version..."
./scripts/prepare-for-firefox.sh

# Create Firefox zip package
echo "Creating Firefox package..."
cd src
zip -r ../dist/youtube_ai_comments_firefox.zip *
cd ..
echo "Firefox package created at dist/youtube_ai_comments_firefox.zip"

# Prepare Chrome version
echo "Preparing Chrome version..."
./scripts/prepare-for-chrome.sh

# Create Chrome zip package
echo "Creating Chrome package..."
cd src
zip -r ../dist/youtube_ai_comments_chrome.zip *
cd ..
echo "Chrome package created at dist/youtube_ai_comments_chrome.zip"

echo "Deployment completed successfully!"
echo "Extension packages are available in the dist directory:"
echo "- Firefox: dist/youtube_ai_comments_firefox.zip"
echo "- Chrome: dist/youtube_ai_comments_chrome.zip"
