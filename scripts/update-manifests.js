#!/usr/bin/env node

/**
 * This script updates the version in all manifest files and package.json
 * Usage: node update-manifests.js <version>
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Manifest files to update
const manifestFiles = [
  'manifest/manifest-chrome-prod.json',
  'manifest/manifest-firefox-dev.json',
  'manifest/manifest-firefox-prod.json',
  'src/manifest.json'
];

// Get version from command line arguments
const version = process.argv[2];

if (!version) {
  console.error('Error: Version is required');
  console.error('Usage: node update-manifests.js <version>');
  process.exit(1);
}

console.log(`Updating manifest files to version ${version}...`);

// Update each manifest file
manifestFiles.forEach(manifestPath => {
  const fullPath = path.join(rootDir, manifestPath);
  
  if (!fs.existsSync(fullPath)) {
    console.error(`Error: Manifest file not found at ${fullPath}`);
    return;
  }
  
  try {
    // Read the manifest file
    const manifest = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    
    // Update the version
    manifest.version = version;
    
    // Write the updated manifest back to the file
    fs.writeFileSync(fullPath, JSON.stringify(manifest, null, 2));
    
    console.log(`Updated ${manifestPath} to version ${version}`);
  } catch (error) {
    console.error(`Error updating ${manifestPath}: ${error.message}`);
  }
});

// Update package.json version
const packageJsonPath = path.join(rootDir, 'package.json');
try {
  // Read the package.json file
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  // Update the version
  packageJson.version = version;

  // Write the updated package.json back to the file
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log(`Updated package.json to version ${version}`);
} catch (error) {
  console.error(`Error updating package.json: ${error.message}`);
}

console.log('All manifest files updated successfully!');
