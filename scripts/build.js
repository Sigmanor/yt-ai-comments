/**
 * Script to build and package the extension for different browsers
 * Replaces the shell script: deploy.sh
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { execSync } from 'child_process';

// Get the directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Define paths
const distDir = path.join(rootDir, 'dist');
const srcDir = path.join(rootDir, 'src');

// Create a zip file
function createZip(source, output) {
  return new Promise((resolve, reject) => {
    // Create dist directory if it doesn't exist
    fs.ensureDirSync(path.dirname(output));
    
    // Create a file to stream archive data to
    const outputStream = fs.createWriteStream(output);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Sets the compression level
    });
    
    // Listen for all archive data to be written
    outputStream.on('close', () => {
      console.log(`Archive created: ${output} (${archive.pointer()} bytes)`);
      resolve();
    });
    
    // Good practice to catch warnings
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn(err);
      } else {
        reject(err);
      }
    });
    
    // Good practice to catch this error explicitly
    archive.on('error', (err) => {
      reject(err);
    });
    
    // Pipe archive data to the file
    archive.pipe(outputStream);
    
    // Append files from a directory
    archive.directory(source, false);
    
    // Finalize the archive
    archive.finalize();
  });
}

async function buildExtension(browser) {
  try {
    console.log("Starting deployment process...");
    
    // Create dist directory if it doesn't exist
    fs.ensureDirSync(distDir);
    
    if (!browser || browser === 'firefox') {
      // Prepare Firefox version
      console.log("Preparing Firefox version...");
      execSync('node scripts/prepare.js firefox', { stdio: 'inherit' });
      
      // Create Firefox zip package
      console.log("Creating Firefox package...");
      await createZip(srcDir, path.join(distDir, 'youtube_ai_comments_firefox.zip'));
      console.log("Firefox package created at dist/youtube_ai_comments_firefox.zip");
    }
    
    if (!browser || browser === 'chrome') {
      // Prepare Chrome version
      console.log("Preparing Chrome version...");
      execSync('node scripts/prepare.js chrome', { stdio: 'inherit' });
      
      // Create Chrome zip package
      console.log("Creating Chrome package...");
      await createZip(srcDir, path.join(distDir, 'youtube_ai_comments_chrome.zip'));
      console.log("Chrome package created at dist/youtube_ai_comments_chrome.zip");
    }
    
    console.log("Deployment completed successfully!");
    console.log("Extension packages are available in the dist directory:");
    
    if (!browser || browser === 'firefox') {
      console.log("- Firefox: dist/youtube_ai_comments_firefox.zip");
    }
    
    if (!browser || browser === 'chrome') {
      console.log("- Chrome: dist/youtube_ai_comments_chrome.zip");
    }
  } catch (error) {
    console.error("Error during build process:", error);
    process.exit(1);
  }
}

// Get browser type from command line argument (optional)
const browser = process.argv[2];

buildExtension(browser);
