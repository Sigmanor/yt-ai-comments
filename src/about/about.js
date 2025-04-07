// Function to apply dark theme
function applyTheme() {
  console.log('Applying dark theme to about page');

  // Apply dark theme to html element
  document.documentElement.setAttribute('data-theme', 'dark');
  console.log('Dark theme applied to about page, data-theme attribute set on HTML');

  // Force a repaint to ensure styles are applied
  const originalDisplay = document.body.style.display;
  document.body.style.display = 'none';
  // Trigger a reflow
  void document.body.offsetHeight;
  document.body.style.display = originalDisplay;

  // Log the current theme state
  console.log('Current HTML data-theme:', document.documentElement.getAttribute('data-theme'));
}

// Apply dark theme before DOM is fully loaded
document.documentElement.setAttribute('data-theme', 'dark');

// Function to get the extension version from manifest.json
function getExtensionVersion() {
  try {
    // Get the manifest data using browser extension API
    const manifest = chrome.runtime.getManifest();
    const version = manifest.version;

    // Update the version element
    const versionElement = document.getElementById('extension-version');
    if (versionElement) {
      versionElement.textContent = version;
    }

    console.log('Version from manifest.json:', version);
    return version;
  } catch (error) {
    console.error('Error getting version from manifest:', error);
    return '1.0.0'; // Default version on error
  }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Apply dark theme
  applyTheme();

  // Get and display the extension version from manifest.json
  getExtensionVersion();
});
