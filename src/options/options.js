// Default values
const defaultOptions = {
  language: 'en',
  provider: 'openai',
  apiKey: '',
  model: '',  // Will be set dynamically based on provider
  maxTokens: 2000,
  temperature: 0.5,
  theme: 'auto', // Auto = system theme, can be 'light', 'dark', or 'auto'
  prompt: 'Write a positive comment to support the YouTube video creator. The comment should be friendly. No less than 10 words, no more than 20 words.'
};

// Get default model based on provider
function getDefaultModel(provider) {
  return provider === 'openai' ? 'gpt-4o-mini' : 'mistral-small-latest';
}

// Simple function to save settings to chrome.storage.sync
function saveToStorage(data) {
  return new Promise((resolve, reject) => {
    try {
      console.log('Attempting to save data to storage:', data);
      chrome.storage.sync.set(data, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving to storage:', chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
        } else {
          console.log('Successfully saved to storage:', data);

          // Verify the data was saved correctly by reading it back
          chrome.storage.sync.get(null, (result) => {
            console.log('Verification - data in storage after save:', result);
            resolve();
          });
        }
      });
    } catch (error) {
      console.error('Exception when saving to storage:', error);
      reject(error);
    }
  });
}

// Simple function to load settings from chrome.storage.sync
function loadFromStorage(keys) {
  return new Promise((resolve, reject) => {
    try {
      console.log('Attempting to load data from storage with keys:', keys);

      // First, get all data to see what's actually in storage
      chrome.storage.sync.get(null, (allData) => {
        console.log('All data currently in storage:', allData);

        // Then get the specific keys we need
        chrome.storage.sync.get(keys, (result) => {
          if (chrome.runtime.lastError) {
            console.error('Error loading from storage:', chrome.runtime.lastError);
            reject(chrome.runtime.lastError);
          } else {
            console.log('Successfully loaded from storage:', result);

            // Check if provider is present in the result
            if (result.provider) {
              console.log('Provider found in storage:', result.provider);
            } else {
              console.warn('Provider not found in storage, using default:', keys.provider);
              result.provider = keys.provider;
            }

            resolve(result);
          }
        });
      });
    } catch (error) {
      console.error('Exception when loading from storage:', error);
      reject(error);
    }
  });
}

// Function to apply theme based on selection or system preference
function applyTheme(theme) {
  console.log('Applying theme:', theme);

  // Remove any existing theme attribute from both html and body
  document.documentElement.removeAttribute('data-theme');
  document.body.removeAttribute('data-theme');

  if (theme === 'dark') {
    // Apply dark theme to both html and body elements
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.setAttribute('data-theme', 'dark');
    console.log('Dark theme applied, data-theme attribute set on HTML and BODY');
  } else if (theme === 'light') {
    // Light theme is default, no need to add attribute
    console.log('Light theme applied, no data-theme attribute needed');
  } else if (theme === 'auto') {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.setAttribute('data-theme', 'dark');
      console.log('Auto theme: system is dark, data-theme attribute set on HTML and BODY');
    } else {
      console.log('Auto theme: system is light, no data-theme attribute needed');
    }

    // Add listener for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (e.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.setAttribute('data-theme', 'dark');
        console.log('System theme changed to dark, data-theme attribute set');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.removeAttribute('data-theme');
        console.log('System theme changed to light, data-theme attribute removed');
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

// Load saved settings
async function loadOptions() {
  console.log('Loading options...');

  try {
    // Load options from storage
    const options = await loadFromStorage(defaultOptions);
    console.log('Loaded options:', options);

    // Set language
    const languageSelect = document.getElementById('language');
    if (languageSelect) {
      const langValue = options.language || defaultOptions.language;
      console.log('Setting language to:', langValue);
      languageSelect.value = langValue;
    }

    // Set provider - this is the field that's not being saved/loaded correctly
    const providerSelect = document.getElementById('provider');
    if (providerSelect) {
      const providerValue = options.provider || defaultOptions.provider;
      console.log('Setting provider to:', providerValue, 'Options provider:', options.provider);

      // Force the value to be set
      providerSelect.value = providerValue;

      // Double-check that the value was set correctly
      setTimeout(() => {
        console.log('Provider value after setting:', providerSelect.value);
        if (providerSelect.value !== providerValue) {
          console.warn('Provider value was not set correctly, trying again...');
          providerSelect.value = providerValue;
        }
      }, 100);
    }

    // Set API key
    const apiKeyInput = document.getElementById('api-key');
    if (apiKeyInput) {
      const apiKeyValue = options.apiKey || '';
      console.log('Setting API key (length):', apiKeyValue.length);
      apiKeyInput.value = apiKeyValue;
    }

    // Set model with default if empty
    if (document.getElementById('model')) {
      const modelValue = options.model || getDefaultModel(options.provider || defaultOptions.provider);
      document.getElementById('model').value = modelValue;
    }

    // Set max tokens
    if (document.getElementById('max-tokens')) {
      document.getElementById('max-tokens').value = options.maxTokens || defaultOptions.maxTokens;
    }

    // Set prompt value
    if (document.getElementById('prompt')) {
      document.getElementById('prompt').value = options.prompt || defaultOptions.prompt;
    }

    // Handle temperature slider
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperature-value');

    if (temperatureSlider && temperatureValue) {
      // Set initial value
      const tempValue = options.temperature !== undefined ? options.temperature : defaultOptions.temperature;
      temperatureSlider.value = tempValue;
      temperatureValue.textContent = tempValue;

      console.log('Set temperature to:', tempValue);
    }

    // Set theme selection
    const themeValue = options.theme || defaultOptions.theme;
    console.log('Setting theme to:', themeValue);
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
      themeSelect.value = themeValue;
    }

    // Apply the theme
    applyTheme(themeValue);

  } catch (error) {
    console.error('Failed to load options:', error);
    alert('Failed to load settings. Using defaults.');
  }

    // Add event listener for provider change
    const providerSelect = document.getElementById('provider');
    if (providerSelect) {
      // Remove existing event listeners by cloning
      const newProviderSelect = providerSelect.cloneNode(true);
      if (providerSelect.parentNode) {
        providerSelect.parentNode.replaceChild(newProviderSelect, providerSelect);
      }

      // Add new event listener
      newProviderSelect.addEventListener('change', function() {
        const provider = this.value;
        const modelInput = document.getElementById('model');
        if (modelInput && (!modelInput.value || modelInput.value === 'gpt-4o-mini' || modelInput.value === 'mistral-small-latest')) {
          modelInput.value = getDefaultModel(provider);
          console.log('Changed model to:', modelInput.value, 'for provider:', provider);
        }
      });
    }
  }

// Save settings
async function saveOptions() {
  try {
    // Get max tokens value and ensure it's a number
    const maxTokensInput = document.getElementById('max-tokens');
    let maxTokens = parseInt(maxTokensInput.value, 10);
    if (isNaN(maxTokens) || maxTokens < 1) {
      maxTokens = defaultOptions.maxTokens;
      maxTokensInput.value = maxTokens;
    }

    // Get temperature value and ensure it's a number
    const temperatureInput = document.getElementById('temperature');
    let temperature = parseFloat(temperatureInput.value);
    if (isNaN(temperature) || temperature < 0 || temperature > 1) {
      temperature = defaultOptions.temperature;
      temperatureInput.value = temperature;
      document.getElementById('temperature-value').textContent = temperature;
    }

    // Get model value, use default if empty
    const modelInput = document.getElementById('model');
    let model = modelInput.value.trim();
    if (!model) {
      model = getDefaultModel(document.getElementById('provider').value);
      modelInput.value = model;
    }

    // Get provider value - this is the field that's not being saved/loaded correctly
    const providerSelect = document.getElementById('provider');
    const providerValue = providerSelect ? providerSelect.value : defaultOptions.provider;
    console.log('Getting provider value for saving:', providerValue);

    // Get selected theme
    const themeSelect = document.getElementById('theme');
    const selectedTheme = themeSelect ? themeSelect.value : defaultOptions.theme;
    console.log('Selected theme:', selectedTheme);

    const options = {
      language: document.getElementById('language').value,
      provider: providerValue,
      apiKey: document.getElementById('api-key').value,
      model: model,
      maxTokens: maxTokens,
      temperature: temperature,
      theme: selectedTheme,
      prompt: document.getElementById('prompt').value
    };

    // Log the options being saved
    console.log('Options being saved:', options);

    console.log('Saving options:', options);

    // Save options to storage
    await saveToStorage(options);

    // Show success message
    const status = document.getElementById('status');
    if (status) {
      status.textContent = 'Settings saved!';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    }

    console.log('Options saved successfully');

    // Test that options were saved correctly
    const savedOptions = await loadFromStorage(options);
    console.log('Verification - options after save:', savedOptions);

    return true;
  } catch (error) {
    console.error('Failed to save options:', error);
    alert('Failed to save settings: ' + error.message);
    return false;
  }
}

// Reset settings to default values
async function resetOptions() {
  try {
    console.log('Resetting to defaults:', defaultOptions);

    // Reset language
    if (document.getElementById('language')) {
      document.getElementById('language').value = defaultOptions.language;
    }

    // Reset provider
    if (document.getElementById('provider')) {
      document.getElementById('provider').value = defaultOptions.provider;
    }

    // Reset API key
    if (document.getElementById('api-key')) {
      document.getElementById('api-key').value = '';
    }

    // Reset model
    if (document.getElementById('model')) {
      document.getElementById('model').value = getDefaultModel(defaultOptions.provider);
    }

    // Reset max tokens
    if (document.getElementById('max-tokens')) {
      document.getElementById('max-tokens').value = defaultOptions.maxTokens;
    }

    // Reset temperature
    const temperatureSlider = document.getElementById('temperature');
    const temperatureValue = document.getElementById('temperature-value');

    if (temperatureSlider && temperatureValue) {
      temperatureSlider.value = defaultOptions.temperature;
      temperatureValue.textContent = defaultOptions.temperature;
    }

    // Reset prompt
    if (document.getElementById('prompt')) {
      document.getElementById('prompt').value = defaultOptions.prompt;
    }

    // Reset theme
    const themeSelect = document.getElementById('theme');
    if (themeSelect) {
      themeSelect.value = defaultOptions.theme;
      applyTheme(defaultOptions.theme);
    }

    // Save the default options
    await saveOptions();

    // Show status message
    const status = document.getElementById('status');
    if (status) {
      status.textContent = 'Settings reset to defaults!';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    }

    return true;
  } catch (error) {
    console.error('Failed to reset options:', error);
    alert('Failed to reset settings: ' + error.message);
    return false;
  }
}

// Initialize the page
// Apply theme from storage before DOM is fully loaded
chrome.storage.sync.get(['theme'], function (result) {
  const theme = result.theme || 'auto';
  if (theme === 'dark' || (theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
});

document.addEventListener('DOMContentLoaded', async function() {
  try {
    console.log('DOM loaded, initializing options page...');

    // Check what's in storage before loading options
    chrome.storage.sync.get(null, (result) => {
      console.log('Initial storage state:', result);
    });

    // Load saved options
    await loadOptions();

    // Double-check provider value after loading
    const providerSelectElem = document.getElementById('provider');
    if (providerSelectElem) {
      console.log('Provider value after loading options:', providerSelectElem.value);

      // Get the actual value from storage directly
      chrome.storage.sync.get(['provider'], (result) => {
        console.log('Provider value directly from storage:', result.provider);
        if (result.provider && providerSelectElem.value !== result.provider) {
          console.warn('Provider mismatch! Setting to value from storage:', result.provider);
          providerSelectElem.value = result.provider;
        }
      });
    }

    // Add input validation for max-tokens field
    const maxTokensInput = document.getElementById('max-tokens');
    if (maxTokensInput) {
      // Prevent non-numeric input
      maxTokensInput.addEventListener('keypress', function (e) {
        // Allow only numbers (0-9) and control keys
        if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
          e.preventDefault();
        }
      });

      // Clean up any non-numeric values on blur
      maxTokensInput.addEventListener('blur', function () {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value === '') {
          this.value = defaultOptions.maxTokens;
        }
      });
    }

    // Add event listeners to buttons
    const saveButton = document.getElementById('save-btn');
    if (saveButton) {
      saveButton.addEventListener('click', async function() {
        console.log('Save button clicked');
        await saveOptions();

        // Verify provider was saved correctly
        const providerElem = document.getElementById('provider');
        if (providerElem) {
          const selectedProvider = providerElem.value;
          console.log('Provider value at save time:', selectedProvider);

          // Check storage directly after save
          setTimeout(() => {
            chrome.storage.sync.get(['provider'], (result) => {
              console.log('Provider in storage after save:', result.provider);
              if (result.provider !== selectedProvider) {
                console.error('Provider was not saved correctly!');
              }
            });
          }, 500);
        }
      });
    }

    const resetButton = document.getElementById('reset-btn');
    if (resetButton) {
      resetButton.addEventListener('click', async function() {
        console.log('Reset button clicked');
        await resetOptions();
      });
    }

    // Add event listener to temperature slider
    const temperatureSlider = document.getElementById('temperature');
    if (temperatureSlider) {
      temperatureSlider.addEventListener('input', function() {
        const temperatureValue = document.getElementById('temperature-value');
        if (temperatureValue) {
          temperatureValue.textContent = this.value;
          console.log('Temperature slider changed to:', this.value);
        }
      });
    }

    // Add event listener for provider change
    const providerChangeElem = document.getElementById('provider');
    if (providerChangeElem) {
      providerChangeElem.addEventListener('change', function() {
        const provider = this.value;
        const modelInput = document.getElementById('model');
        if (modelInput && (!modelInput.value || modelInput.value === 'gpt-4o-mini' || modelInput.value === 'mistral-small-latest')) {
          modelInput.value = getDefaultModel(provider);
          console.log('Changed model to:', modelInput.value, 'for provider:', provider);
        }

        // Save the provider change immediately
        console.log('Provider changed to:', provider, '- saving immediately');
        chrome.storage.sync.set({ provider: provider }, () => {
          console.log('Provider saved after change');

          // Verify it was saved
          chrome.storage.sync.get(['provider'], (result) => {
            console.log('Provider in storage after change:', result.provider);
          });
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

        // Save the theme change immediately
        chrome.storage.sync.set({ theme: selectedTheme }, () => {
          console.log('Theme saved after change');
        });
      });
    };

    console.log('Options page initialized successfully');

    // Add event listener for the About button
    const aboutButton = document.getElementById('about-button');
    if (aboutButton) {
      aboutButton.addEventListener('click', function () {
        console.log('About button clicked');
        // Open about.html in a new window
        window.open(chrome.runtime.getURL('about/about.html'), '_blank', 'width=600,height=830');
      });
    }
  } catch (error) {
    console.error('Error initializing options page:', error);
    alert('Error initializing options page: ' + error.message);
  }
});
