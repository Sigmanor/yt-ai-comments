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

// Function to fetch the latest version from GitHub
async function fetchLatestVersion() {
  try {
    const response = await fetch('https://api.github.com/repos/Sigmanor/yt-ai-comments/tags');
    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const tags = await response.json();
    if (tags && tags.length > 0) {
      // Get the latest tag (first in the array)
      const latestTag = tags[0].name;
      // Remove 'v' prefix if present
      const version = latestTag.startsWith('v') ? latestTag.substring(1) : latestTag;

      // Update the version element
      const versionElement = document.getElementById('extension-version');
      if (versionElement) {
        versionElement.textContent = version;
      }

      console.log('Latest version fetched from GitHub:', version);
      return version;
    } else {
      console.log('No tags found in the repository');
      return '1.0.0'; // Default version if no tags found
    }
  } catch (error) {
    console.error('Error fetching version from GitHub:', error);
    return '1.0.0'; // Default version on error
  }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Apply dark theme
  applyTheme();

  // Fetch and display the latest version
  fetchLatestVersion();
});
