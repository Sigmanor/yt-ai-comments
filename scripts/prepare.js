/**
 * Script to prepare the extension for different browsers
 * Replaces the shell scripts:
 * - prepare-for-chrome-prod.sh
 * - prepare-for-firefox-prod.sh
 * - prepare-for-firefox-dev.sh
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Define manifest paths
const manifestDir = path.join(rootDir, 'manifest');
const srcManifestPath = path.join(rootDir, 'src', 'manifest.json');

async function prepareExtension(browser) {
  console.log(`Preparing extension for ${browser}...`);
  
  // Check if src directory exists
  if (!fs.existsSync(path.join(rootDir, 'src'))) {
    console.error("Error: 'src' directory not found!");
    process.exit(1);
  }
  
  let manifestSource;
  
  switch (browser) {
    case 'chrome':
      manifestSource = path.join(manifestDir, 'manifest-chrome-prod.json');
      break;
    case 'firefox':
      manifestSource = path.join(manifestDir, 'manifest-firefox-prod.json');
      break;
    case 'firefox-dev':
      manifestSource = path.join(manifestDir, 'manifest-firefox-dev.json');
      break;
    default:
      console.error(`Error: Unknown browser type '${browser}'`);
      process.exit(1);
  }
  
  // Check if manifest file exists
  if (!fs.existsSync(manifestSource)) {
    console.error(`Error: '${manifestSource}' file not found!`);
    process.exit(1);
  }
  
  // Create a backup of the original manifest.json if it doesn't exist yet
  if (fs.existsSync(srcManifestPath) && 
      !fs.existsSync(path.join(manifestDir, 'manifest-chrome-prod.json')) && 
      browser.includes('firefox')) {
    console.log("Creating backup of the original manifest.json...");
    fs.copySync(srcManifestPath, path.join(manifestDir, 'manifest-chrome-prod.json'));
  }
  
  // Replace manifest.json with the specified version
  console.log(`Replacing manifest.json with the ${browser} version...`);
  fs.copySync(manifestSource, srcManifestPath);
  
  console.log("Done! Now you can install the extension.");
  
  if (browser === 'chrome') {
    console.log("To install in Chrome, go to chrome://extensions/");
    console.log("enable Developer mode and select 'Load unpacked extension'.");
  } else {
    console.log("To install in Firefox, go to about:debugging#/runtime/this-firefox");
    console.log("and select the manifest.json file in the src folder.");
    if (browser === 'firefox-prod') {
      console.log("Note: The extension now has a permanent ID to enable storage functionality.");
    }
  }
}

// Get browser type from command line argument
const browser = process.argv[2];

if (!browser) {
  console.error("Error: Please specify a browser type (chrome, firefox, or firefox-dev)");
  process.exit(1);
}

prepareExtension(browser);
