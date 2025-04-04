// Function to apply theme based on selection or system preference
function applyTheme(theme) {
  console.log('Applying theme to popup:', theme);

  // Remove any existing theme attribute from both html and body
  document.documentElement.removeAttribute('data-theme');
  document.body.removeAttribute('data-theme');

  if (theme === 'dark') {
    // Apply dark theme to both html and body elements
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    console.log('Dark theme applied to popup, data-theme attribute set on HTML and BODY');
  } else if (theme === 'light') {
    // Light theme is default, no need to add attribute
    console.log('Light theme applied to popup, no data-theme attribute needed');
  } else if (theme === 'auto') {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
      console.log('Auto theme in popup: system is dark, data-theme attribute set on HTML and BODY');
    } else {
      console.log('Auto theme in popup: system is light, no data-theme attribute needed');
    }

    // Add listener for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
        console.log('System theme changed to dark in popup, data-theme attribute set');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme');
        console.log('System theme changed to light in popup, data-theme attribute removed');
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
  console.log('Current BODY data-theme:', document.body.getAttribute('data-theme'));
}

// Apply theme from storage before DOM is fully loaded
chrome.storage.sync.get(['theme'], function (result) {
  const theme = result.theme || 'auto';
  if (theme === 'dark' || (theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Default values
  const defaultOptions = {
    language: 'en',
    theme: 'auto'
  };

  // Load saved options
  chrome.storage.sync.get(defaultOptions, function (options) {
    console.log('Loaded options:', options);

    // Set language dropdown
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
      languageSelect.value = options.language || defaultOptions.language;
    }

    // Set and apply theme
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
      themeSelect.value = options.theme || defaultOptions.theme;
    }
    applyTheme(options.theme || defaultOptions.theme);
  });

  // Add event listener for language change
  const languageSelect = document.getElementById('language');
  if (languageSelect) {
    languageSelect.addEventListener('change', function () {
      const selectedLanguage = this.value;
      console.log('Language changed to:', selectedLanguage);

      // Save the language change
      chrome.storage.sync.set({ language: selectedLanguage }, () => {
        console.log('Language saved after change');
      });
    });
  }

  // Add event listener for theme change
  const themeSelect = document.getElementById('theme');
  if (themeSelect) {
    themeSelect.addEventListener('change', function () {
      const selectedTheme = this.value;
      console.log('Theme changed to:', selectedTheme);

      // Apply theme immediately
      applyTheme(selectedTheme);

      // Save the theme change
      chrome.storage.sync.set({ theme: selectedTheme }, () => {
        console.log('Theme saved after change');
      });
    });
  }

  // Open settings page when button is clicked
  document.getElementById('options-btn').addEventListener('click', function () {
    chrome.runtime.openOptionsPage();
  });
});
