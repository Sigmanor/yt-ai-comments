/**
 * Script to build and package the extension for different browsers
 * Replaces the shell script: deploy.sh
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

// Get the directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Define paths
const distDir = path.join(rootDir, 'dist');
const srcDir = path.join(rootDir, 'src');
const manifestDir = path.join(rootDir, 'manifest');
const tempDir = path.join(rootDir, 'temp_build');

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

// Function to prepare a temporary build directory with the correct manifest
async function prepareTempBuild(browser) {
  // Create and clean temp directory
  const browserTempDir = path.join(tempDir, browser);
  fs.ensureDirSync(browserTempDir);
  fs.emptyDirSync(browserTempDir);

  // Copy all source files to temp directory
  fs.copySync(srcDir, browserTempDir, {
    filter: (src) => {
      // Don't copy the manifest.json file from src
      return src !== path.join(srcDir, 'manifest.json');
    }
  });

  // Copy the appropriate manifest file
  let manifestSource;
  switch (browser) {
    case 'firefox':
      manifestSource = path.join(manifestDir, 'manifest-firefox-prod.json');
      break;
    case 'chrome':
      manifestSource = path.join(manifestDir, 'manifest-chrome-prod.json');
      break;
    default:
      throw new Error(`Unknown browser type: ${browser}`);
  }

  // Copy the manifest file to the temp directory
  fs.copySync(manifestSource, path.join(browserTempDir, 'manifest.json'));

  return browserTempDir;
}

async function buildExtension(browser) {
  try {
    console.log("Starting deployment process...");

    // Create dist directory if it doesn't exist
    fs.ensureDirSync(distDir);

    if (!browser || browser === 'firefox') {
      // Prepare Firefox version
      console.log("Preparing Firefox version...");
      const firefoxTempDir = await prepareTempBuild('firefox');

      // Create Firefox zip package
      console.log("Creating Firefox package...");
      await createZip(firefoxTempDir, path.join(distDir, 'youtube_ai_comments_firefox.zip'));
      console.log("Firefox package created at dist/youtube_ai_comments_firefox.zip");
    }

    if (!browser || browser === 'chrome') {
      // Prepare Chrome version
      console.log("Preparing Chrome version...");
      const chromeTempDir = await prepareTempBuild('chrome');

      // Create Chrome zip package
      console.log("Creating Chrome package...");
      await createZip(chromeTempDir, path.join(distDir, 'youtube_ai_comments_chrome.zip'));
      console.log("Chrome package created at dist/youtube_ai_comments_chrome.zip");
    }

    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir);
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

    // Clean up temp directory even if there's an error
    if (fs.existsSync(tempDir)) {
      fs.removeSync(tempDir);
    }

    process.exit(1);
  }
}

// Get browser type from command line argument (optional)
const browser = process.argv[2];

buildExtension(browser);
