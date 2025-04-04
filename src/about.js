// Function to apply theme based on selection or system preference
function applyTheme(theme) {
  console.log('Applying theme to about page:', theme);

  // Remove any existing theme attribute from html
  document.documentElement.removeAttribute('data-theme');

  if (theme === 'dark') {
    // Apply dark theme to html element
    document.documentElement.setAttribute('data-theme', 'dark');
    console.log('Dark theme applied to about page, data-theme attribute set on HTML');
  } else if (theme === 'light') {
    // Light theme is default, no need to add attribute
    console.log('Light theme applied to about page, no data-theme attribute needed');
  } else if (theme === 'auto') {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
      console.log('Auto theme in about page: system is dark, data-theme attribute set on HTML');
    } else {
      console.log('Auto theme in about page: system is light, no data-theme attribute needed');
    }

    // Add listener for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        console.log('System theme changed to dark in about page, data-theme attribute set');
      } else {
        document.documentElement.removeAttribute('data-theme');
        console.log('System theme changed to light in about page, data-theme attribute removed');
      }
    });
  }

  // Force a repaint to ensure styles are applied
  const originalDisplay = document.body.style.display;
  document.body.style.display = 'none';
  // Trigger a reflow
  void document.body.offsetHeight;
  document.body.style.display = originalDisplay;

  // Log the current theme state
  console.log('Current HTML data-theme:', document.documentElement.getAttribute('data-theme'));
}

// Apply theme from storage before DOM is fully loaded
chrome.storage.sync.get(['theme'], function (result) {
  const theme = result.theme || 'auto';
  if (theme === 'dark' || (theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Apply theme from storage
  chrome.storage.sync.get(['theme'], function (options) {
    applyTheme(options.theme || 'auto');
  });
});
