// Global variable to track if the button has been added
let buttonAdded = false;
let observer = null;
let checkInterval = null;

// Function to add the comment generation button
function addGenerateButton() {
  // Check if we are on a YouTube page
  if (!window.location.hostname.includes('youtube.com')) {
    return;
  }

  // Clear previous intervals and observers
  clearPreviousListeners();

  // Function to find the YouTube comment buttons container
  function findCommentButtonsContainer() {
    // Try to find the YouTube comment buttons container using the provided selector
    const buttonsContainer = document.querySelector('#thumbnail-input-row > div:nth-child(2) > div:nth-child(7) > div:nth-child(7)');

    if (buttonsContainer) {
      return buttonsContainer;
    }

    // Try to find the container with the "Коментувати" button
    const commentButton = Array.from(document.querySelectorAll('button')).find(btn =>
      btn.textContent.includes('Коментувати') || btn.textContent.includes('Comment')
    );

    if (commentButton) {
      const container = commentButton.closest('div[class*="style-scope"]');
      if (container) {
        return container.parentElement || container;
      }
    }

    // Try alternative selectors if the specific one doesn't work
    const alternativeContainer = document.querySelector('#thumbnail-input-row ytd-button-renderer');
    if (alternativeContainer && alternativeContainer.parentElement) {
      return alternativeContainer.parentElement;
    }

    // Try to find any button container in the comment area
    const commentArea = document.querySelector('ytd-comments ytd-comment-simplebox-renderer');
    if (commentArea) {
      const buttons = commentArea.querySelectorAll('ytd-button-renderer');
      if (buttons.length > 0 && buttons[0].parentElement) {
        return buttons[0].parentElement;
      }
    }
    return null;
  }

  // Function to add a button to the comment buttons container
  function addGenerateButton() {
    // If the button is already added to the page, remove all existing buttons
    const existingButtons = document.querySelectorAll('.ai-comment-generator-btn, .ai-comment-dropdown-container');
    existingButtons.forEach(btn => btn.remove());

    // Find the comment buttons container
    const buttonsContainer = findCommentButtonsContainer();
    if (!buttonsContainer) {
      return false;
    }

    // Create dropdown container to hold the button and menu
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'ai-comment-dropdown-container';
    dropdownContainer.style.position = 'relative';
    dropdownContainer.style.display = 'inline-block';
    dropdownContainer.style.marginRight = '8px';

    // Create main button with magic wand icon
    const button = document.createElement('button');
    button.className = 'ai-comment-generator-btn';
    button.innerHTML = '<img src="' + chrome.runtime.getURL('icons/magic-wand.png') + '" alt="Generate" class="ai-comment-icon" />';
    button.title = 'Generate a comment using AI';

    // Try to match YouTube's button style
    try {
      // Find YouTube's buttons to copy their style
      const youtubeButtons = document.querySelectorAll('button');
      let targetButton = null;

      // Prefer the "Comment"/"Коментувати" button
      for (const btn of youtubeButtons) {
        if (btn.textContent.includes('Коментувати') || btn.textContent.includes('Comment')) {
          targetButton = btn;
          break;
        }
      }
      // Fallback to "Cancel"/"Скасувати" button
      if (!targetButton) {
        for (const btn of youtubeButtons) {
          if (btn.textContent.includes('Скасувати') || btn.textContent.includes('Cancel')) {
            targetButton = btn;
            break;
          }
        }
      }

      if (targetButton) {
        const computedStyle = window.getComputedStyle(targetButton);
        button.style.height = computedStyle.height;
        button.style.borderRadius = computedStyle.borderRadius;
        button.style.fontFamily = computedStyle.fontFamily;
        button.style.fontSize = computedStyle.fontSize;
        button.style.fontWeight = computedStyle.fontWeight;
        button.style.lineHeight = computedStyle.lineHeight;
        button.style.padding = computedStyle.padding;
        button.style.marginRight = '8px';
        // Force our specific red style regardless of copied styles
        button.style.backgroundColor = 'rgb(204, 59, 59)';
        button.style.color = '#ffffff';
        button.style.border = computedStyle.border;
        button.style.cursor = 'pointer';
      } else {
        // Minimal fallback styles
        button.style.height = '36px';
        button.style.padding = '0 16px';
        button.style.marginRight = '8px';
        button.style.borderRadius = '18px';
        button.style.fontSize = '14px';
        button.style.fontWeight = '500';
        button.style.cursor = 'pointer';
        button.style.border = 'none';
        // Ensure our specific red style in fallback too
        button.style.backgroundColor = 'rgb(204, 59, 59)';
        button.style.color = '#ffffff';
      }
    } catch (error) {
      console.error('Error copying YouTube button style:', error);
    }

    // Create dropdown menu
    const dropdownMenu = document.createElement('div');
    dropdownMenu.style.display = 'none';
    dropdownMenu.style.position = 'absolute';
    dropdownMenu.style.top = '100%';
    dropdownMenu.style.left = '0';
    dropdownMenu.style.borderRadius = '4px';
    dropdownMenu.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    dropdownMenu.style.zIndex = '10000';
    dropdownMenu.style.minWidth = '200px';
    dropdownMenu.style.padding = '8px 0';

    // Theme detection
    const isDarkTheme = document.documentElement.getAttribute('dark') !== null ||
      document.body.classList.contains('dark') ||
      (window.getComputedStyle(document.body).backgroundColor || '').includes('rgb(15, 15, 15)') ||
      document.querySelector('html[dark]') !== null;

    if (isDarkTheme) {
      dropdownMenu.style.backgroundColor = '#282828';
      dropdownMenu.style.border = '1px solid #404040';
      dropdownMenu.style.color = '#fff';
    } else {
      dropdownMenu.style.backgroundColor = '#fff';
      dropdownMenu.style.border = '1px solid #ccc';
      dropdownMenu.style.color = '#333';
    }

    // Mood section
    const moodSection = document.createElement('div');
    moodSection.style.padding = '8px 12px';
    moodSection.style.borderBottom = isDarkTheme ? '1px solid #404040' : '1px solid #eee';

    const moodLabel = document.createElement('div');
    moodLabel.textContent = 'Mood:';
    moodLabel.style.fontSize = '12px';
    moodLabel.style.fontWeight = 'bold';
    moodLabel.style.marginBottom = '4px';
    moodLabel.style.color = isDarkTheme ? '#ccc' : '#666';

    const moodSelect = document.createElement('select');
    moodSelect.id = 'ai-comment-mood';
    moodSelect.style.width = '100%';
    moodSelect.style.padding = '4px';
    moodSelect.style.border = isDarkTheme ? '1px solid #404040' : '1px solid #ccc';
    moodSelect.style.borderRadius = '3px';
    moodSelect.style.fontSize = '12px';
    moodSelect.style.backgroundColor = isDarkTheme ? '#1f1f1f' : '#fff';
    moodSelect.style.color = isDarkTheme ? '#fff' : '#333';

    const moods = [
      { value: 'neutral', text: 'Neutral' },
      { value: 'positive', text: 'Positive' },
      { value: 'enthusiastic', text: 'Enthusiastic' },
      { value: 'funny', text: 'Funny' },
      { value: 'ironic', text: 'Ironic' },
      { value: 'critical', text: 'Critical' },
      { value: 'supportive', text: 'Supportive' }
    ];

    // First create options with default selection
    moods.forEach(mood => {
      const option = document.createElement('option');
      option.value = mood.value;
      option.textContent = mood.text;
      if (mood.value === 'neutral') option.selected = true;
      moodSelect.appendChild(option);
    });

    // Then get the saved mood from storage and update selection if available
    chrome.storage.sync.get({ savedMood: 'neutral' }, function (data) {
      const savedMood = data.savedMood;
      if (savedMood && savedMood !== 'neutral') {
        // Find and select the saved option
        for (let i = 0; i < moodSelect.options.length; i++) {
          if (moodSelect.options[i].value === savedMood) {
            moodSelect.selectedIndex = i;
            break;
          }
        }
      }
    });

    moodSection.appendChild(moodLabel);
    moodSection.appendChild(moodSelect);
    moodSection.addEventListener('click', (e) => e.stopPropagation());

    // Save mood selection when it changes
    moodSelect.addEventListener('change', (e) => {
      const selectedMood = e.target.value;
      chrome.storage.sync.set({ savedMood: selectedMood }, function () { });
    });

    // Language section
    const langSection = document.createElement('div');
    langSection.style.padding = '8px 12px';

    const langLabel = document.createElement('div');
    langLabel.textContent = 'Language:';
    langLabel.style.fontSize = '12px';
    langLabel.style.fontWeight = 'bold';
    langLabel.style.marginBottom = '4px';
    langLabel.style.color = isDarkTheme ? '#ccc' : '#666';

    const langSelect = document.createElement('select');
    langSelect.id = 'ai-comment-language';
    langSelect.style.width = '100%';
    langSelect.style.padding = '4px';
    langSelect.style.border = isDarkTheme ? '1px solid #404040' : '1px solid #ccc';
    langSelect.style.borderRadius = '3px';
    langSelect.style.fontSize = '12px';
    langSelect.style.backgroundColor = isDarkTheme ? '#1f1f1f' : '#fff';
    langSelect.style.color = isDarkTheme ? '#fff' : '#333';

    const languages = [
      { value: 'default', text: 'Use Settings Language' },
      { value: 'uk', text: 'Ukrainian' },
      { value: 'en', text: 'English' },
      { value: 'pl', text: 'Polish' },
      { value: 'de', text: 'German' },
      { value: 'fr', text: 'French' }
    ];

    languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.value;
      option.textContent = lang.text;
      if (lang.value === 'default') option.selected = true;
      langSelect.appendChild(option);
    });

    langSection.appendChild(langLabel);
    langSection.appendChild(langSelect);
    langSection.addEventListener('click', (e) => e.stopPropagation());

    // Generate action button inside dropdown
    const generateBtn = document.createElement('button');
    generateBtn.textContent = 'Generate Comment';
    generateBtn.style.width = 'calc(100% - 16px)';
    generateBtn.style.margin = '8px';
    generateBtn.style.padding = '8px';
    generateBtn.style.backgroundColor = '#1976d2';
    generateBtn.style.color = 'white';
    generateBtn.style.border = 'none';
    generateBtn.style.borderRadius = '3px';
    generateBtn.style.cursor = 'pointer';
    generateBtn.style.fontSize = '12px';
    generateBtn.style.transition = 'background-color 0.2s';

    generateBtn.addEventListener('mouseenter', () => {
      generateBtn.style.backgroundColor = '#1565c0';
    });
    generateBtn.addEventListener('mouseleave', () => {
      generateBtn.style.backgroundColor = '#1976d2';
    });
    generateBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const mood = moodSelect.value;
      const language = langSelect.value;

      // Save the current mood selection
      chrome.storage.sync.set({ savedMood: mood }, function () { });

      dropdownMenu.style.display = 'none';
      generateComment(mood, language);
    });

    // Assemble dropdown menu
    dropdownMenu.appendChild(moodSection);
    dropdownMenu.appendChild(langSection);
    dropdownMenu.appendChild(generateBtn);

    // Toggle dropdown on main button click
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = dropdownMenu.style.display === 'block';
      dropdownMenu.style.display = isVisible ? 'none' : 'block';
    });

    // Hover effect for main button (match requested RGB)
    button.addEventListener('mouseenter', () => {
      button.style.backgroundColor = 'rgb(184, 73, 73)';
    });
    button.addEventListener('mouseleave', () => {
      button.style.backgroundColor = 'rgb(204, 59, 59)';
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
      dropdownMenu.style.display = 'none';
    });

    // Prevent dropdown from closing when interacting inside
    dropdownMenu.addEventListener('click', (e) => e.stopPropagation());

    // Mount elements
    dropdownContainer.appendChild(button);
    dropdownContainer.appendChild(dropdownMenu);

    // Try to find the best place to insert our button
    // First, look for the "Cancel" or "Скасувати" button
    const cancelButton = Array.from(buttonsContainer.querySelectorAll('button')).find(btn =>
      btn.textContent.includes('Скасувати') || btn.textContent.includes('Cancel')
    );

    if (cancelButton && cancelButton.parentElement) {
      // Insert our dropdown container after the cancel button
      if (cancelButton.nextSibling) {
        cancelButton.parentElement.insertBefore(dropdownContainer, cancelButton.nextSibling);
      } else {
        cancelButton.parentElement.appendChild(dropdownContainer);
      }
      buttonAdded = true;
      return true;
    }

    // If we can't find the cancel button, try to insert before the first button
    const firstButton = buttonsContainer.querySelector('ytd-button-renderer, button');
    if (firstButton) {
      // Check if this is the comment button
      const isCommentButton = firstButton.textContent &&
        (firstButton.textContent.includes('Коментувати') || firstButton.textContent.includes('Comment'));

      if (isCommentButton) {
        // Insert before the comment button
        buttonsContainer.insertBefore(dropdownContainer, firstButton);
      } else {
        // Insert after the first button
        if (firstButton.nextSibling) {
          buttonsContainer.insertBefore(dropdownContainer, firstButton.nextSibling);
        } else {
          buttonsContainer.appendChild(dropdownContainer);
        }
      }

      buttonAdded = true;
      return true;
    } else {
      // If no button found, just append dropdown container to the container
      buttonsContainer.appendChild(dropdownContainer);
      buttonAdded = true;
      return true;
    }
  }

  // Function to get the video title
  function getVideoTitle() {
    const titleElement = document.querySelector('yt-formatted-string.ytd-watch-metadata:nth-child(1)');
    if (titleElement) {
      return titleElement.textContent.trim();
    }

    // Try alternative selectors if the specific one doesn't work
    const altTitleElement = document.querySelector('h1.ytd-watch-metadata yt-formatted-string');
    if (altTitleElement) {
      return altTitleElement.textContent.trim();
    }

    // Try more general selector
    const anyTitleElement = document.querySelector('h1 yt-formatted-string');
    if (anyTitleElement) {
      return anyTitleElement.textContent.trim();
    }

    return 'Unknown Video Title';
  }

  // Function to generate a comment
  function generateComment(mood, selectedLanguage) {
    // Show loading indicator
    const button = document.querySelector('.ai-comment-generator-btn');
    if (!button) return;

    const originalHTML = button.innerHTML;
    button.innerHTML = '⏳ Generating...';
    button.disabled = true;

    // Get the video title
    const videoTitle = getVideoTitle();

    // Define default options
    const defaultOptions = {
      language: 'en',
      provider: 'openai',
      apiKey: '',
      model: '',
      maxTokens: 2000,
      temperature: 0.5,
      prompt: 'Write a positive comment to support the YouTube video creator. The comment should be friendly. No less than 10 words, no more than 20 words.'
    };

    // Function to get default model based on provider
    function getDefaultModel(provider) {
      if (provider === 'openai') {
        return 'gpt-4o-mini';
      } else if (provider === 'mistralai') {
        return 'mistral-small-latest';
      } else if (provider === 'openrouter') {
        return 'openai/gpt-4.1-nano';
      }
      return 'gpt-4o-mini'; // Default to OpenAI if provider is unknown
    }

    chrome.storage.sync.get(defaultOptions, function(options) {
      try {
        // Apply optional language override from dropdown if provided
        if (selectedLanguage && selectedLanguage !== 'default') {
          options.language = selectedLanguage;
        }

        // Set defaults if not present
        if (!options.model) {
          options.model = getDefaultModel(options.provider || 'openai');
        }

        if (!options.maxTokens) {
          options.maxTokens = 2000;
        }

        if (options.temperature === undefined) {
          options.temperature = 0.5;
        }

        // Build mood instruction if provided (skip for neutral)
        const moodInstruction = mood && mood !== 'neutral'
          ? ` Write the comment in a ${mood} tone.`
          : '';

        // Add video title and mood to the prompt
        if (options.prompt) {
          options.prompt = `${options.prompt} Video title: "${videoTitle}".${moodInstruction}`;
        }

        if (!options.apiKey) {
          alert('Please add an API key in the extension settings');
          button.innerHTML = originalHTML;
          button.disabled = false;
          return;
        }

        // Send request to generate a comment
        chrome.runtime.sendMessage(
          {
            action: 'generateComment',
            options: options
          },
          function (response) {
            if (button) {
              button.innerHTML = originalHTML;
              button.disabled = false;
            }

            if (response && response.success) {
              // Insert the generated comment into the input field
              console.log('Looking for comment input field...');

              // Try multiple selectors to find the comment input field
              let commentInput = document.querySelector('#contenteditable-root');

              if (!commentInput) {
                console.log('Could not find #contenteditable-root, trying alternative selectors...');
                commentInput = document.querySelector('[contenteditable="true"][aria-label="Додайте коментар…"]');
              }

              if (!commentInput) {
                console.log('Still could not find comment field, trying more selectors...');
                commentInput = document.querySelector('[contenteditable="true"][aria-label="Add a comment…"]');
              }

              if (!commentInput) {
                console.log('Trying to find any contenteditable element in the comment area...');
                const commentArea = document.querySelector('ytd-comments ytd-comment-simplebox-renderer');
                if (commentArea) {
                  commentInput = commentArea.querySelector('[contenteditable="true"]');
                }
              }

              if (commentInput) {
                commentInput.textContent = response.comment;
                commentInput.dispatchEvent(new Event('input', { bubbles: true }));

                // Focus on the input field
                commentInput.focus();
              } else {
                console.error('Could not find the comment input field');
                alert('Could not find the comment input field. Please try clicking on the comment area first.');
              }
            } else {
              alert(`Error: ${response?.error || 'Failed to generate comment'}`);
            }
          }
        );
      } catch (error) {
        console.error('Error in comment generation:', error);
        if (button) {
          button.innerHTML = originalHTML;
          button.disabled = false;
        }
        alert('Error: ' + error.message);
      }
    });
  }

  // Function to clear previous listeners
  function clearPreviousListeners() {
    buttonAdded = false;

    // Clear previous interval
    if (checkInterval) {
      clearInterval(checkInterval);
      checkInterval = null;
    }

    // Disconnect previous observer
    if (observer) {
      observer.disconnect();
      observer = null;
    }

    // Remove all existing buttons
    const existingButtons = document.querySelectorAll('.ai-comment-generator-btn');
    existingButtons.forEach(btn => btn.remove());
  }

  // Function to check for comment input focus and add button when needed
  function setupCommentFocusListener() {
    // Find all possible comment input fields
    const possibleInputs = [
      '#contenteditable-root',
      '[contenteditable="true"][aria-label="Додайте коментар…"]',
      '[contenteditable="true"][aria-label="Add a comment…"]',
      'ytd-comments [contenteditable="true"]'
    ];

    // Add focus event listeners to all possible inputs
    possibleInputs.forEach(selector => {
      document.addEventListener('focusin', (event) => {
        // Check if the focused element matches our selectors
        if (event.target.matches(selector) || event.target.closest(selector)) {
          // Wait a short time for YouTube to render its buttons
          setTimeout(() => {
            if (!buttonAdded) {
              addGenerateButton();
            }
          }, 300);
        }
      });
    });

    // Also check periodically for the buttons container
    let attempts = 0;
    checkInterval = setInterval(() => {
      attempts++;

      // Try to add the button if it's not already added
      if (!buttonAdded) {
        addGenerateButton();
      }

      // If 30 seconds (15 attempts) have passed and the button is not added, stop the interval
      if (attempts >= 15 || buttonAdded) {
        clearInterval(checkInterval);
        checkInterval = null;
      }
    }, 2000);
  }

  // Setup the focus listener
  setupCommentFocusListener();

  // Also check when DOM changes, but only if the button has not been added yet
  observer = new MutationObserver((_mutations) => {
    if (!buttonAdded) {
      addGenerateButton();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Start the button adding function
addGenerateButton();

// Also run the function when URL changes (for SPA)
let lastUrl = location.href;
const urlObserver = new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    console.log('URL changed, adding button again');
    addGenerateButton();
  }
});

urlObserver.observe(document, { subtree: true, childList: true });

// Add message handler from popup
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'checkYouTube') {
    sendResponse({ isYouTube: window.location.hostname.includes('youtube.com') });
  }
  return true; // Required for asynchronous response
});
