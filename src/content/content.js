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
    console.log('Looking for comment buttons container...');

    // Try to find the YouTube comment buttons container using the provided selector
    const buttonsContainer = document.querySelector('#thumbnail-input-row > div:nth-child(2) > div:nth-child(7) > div:nth-child(7)');

    if (buttonsContainer) {
      console.log('Found comment buttons container:', buttonsContainer);
      return buttonsContainer;
    }

    // Try to find the container with the "Коментувати" button
    const commentButton = Array.from(document.querySelectorAll('button')).find(btn =>
      btn.textContent.includes('Коментувати') || btn.textContent.includes('Comment')
    );

    if (commentButton) {
      const container = commentButton.closest('div[class*="style-scope"]');
      if (container) {
        console.log('Found comment buttons container via Comment button:', container);
        return container.parentElement || container;
      }
    }

    // Try alternative selectors if the specific one doesn't work
    const alternativeContainer = document.querySelector('#thumbnail-input-row ytd-button-renderer');
    if (alternativeContainer && alternativeContainer.parentElement) {
      console.log('Found comment buttons container using alternative selector:', alternativeContainer.parentElement);
      return alternativeContainer.parentElement;
    }

    // Try to find any button container in the comment area
    const commentArea = document.querySelector('ytd-comments ytd-comment-simplebox-renderer');
    if (commentArea) {
      const buttons = commentArea.querySelectorAll('ytd-button-renderer');
      if (buttons.length > 0 && buttons[0].parentElement) {
        console.log('Found comment buttons container by searching comment area:', buttons[0].parentElement);
        return buttons[0].parentElement;
      }
    }

    console.log('Could not find comment buttons container');
    return null;
  }

  // Function to add a button to the comment buttons container
  function addGenerateButton() {
    // If the button is already added to the page, remove all existing buttons
    const existingButtons = document.querySelectorAll('.ai-comment-generator-btn');
    existingButtons.forEach(btn => btn.remove());

    // Find the comment buttons container
    const buttonsContainer = findCommentButtonsContainer();
    if (!buttonsContainer) {
      console.log('Could not find buttons container, cannot add generate button');
      return false;
    }

    // Create a new button that matches YouTube's style
    const button = document.createElement('button');
    button.className = 'ai-comment-generator-btn';
    button.textContent = 'Generate Comment';
    button.title = 'Generate a comment using AI';

    // Try to match YouTube's button style
    try {
      // Find YouTube's buttons to copy their style
      const youtubeButtons = document.querySelectorAll('button');
      let commentButton = null;

      // Find the "Comment" or "Коментувати" button
      for (const btn of youtubeButtons) {
        if (btn.textContent.includes('Коментувати') || btn.textContent.includes('Comment')) {
          commentButton = btn;
          break;
        }
      }

      if (commentButton) {
        // Copy some styles from the YouTube button
        const computedStyle = window.getComputedStyle(commentButton);
        button.style.height = computedStyle.height;
        button.style.borderRadius = computedStyle.borderRadius;
        button.style.fontFamily = computedStyle.fontFamily;
        button.style.fontSize = computedStyle.fontSize;
        button.style.fontWeight = computedStyle.fontWeight;
        button.style.lineHeight = computedStyle.lineHeight;
        button.style.padding = '0 16px';
        button.style.marginRight = '8px';

        console.log('Copied styles from YouTube button');
      }
    } catch (error) {
      console.error('Error copying YouTube button style:', error);
    }

    // Add click handler
    button.addEventListener('click', generateComment);

    // Try to find the best place to insert our button
    // First, look for the "Cancel" or "Скасувати" button
    const cancelButton = Array.from(buttonsContainer.querySelectorAll('button')).find(btn =>
      btn.textContent.includes('Скасувати') || btn.textContent.includes('Cancel')
    );

    if (cancelButton && cancelButton.parentElement) {
      // Insert our button after the cancel button
      if (cancelButton.nextSibling) {
        cancelButton.parentElement.insertBefore(button, cancelButton.nextSibling);
      } else {
        cancelButton.parentElement.appendChild(button);
      }
      buttonAdded = true;
      console.log('Comment generation button added after Cancel button');
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
        buttonsContainer.insertBefore(button, firstButton);
      } else {
        // Insert after the first button
        if (firstButton.nextSibling) {
          buttonsContainer.insertBefore(button, firstButton.nextSibling);
        } else {
          buttonsContainer.appendChild(button);
        }
      }

      buttonAdded = true;
      console.log('Comment generation button added relative to YouTube button');
      return true;
    } else {
      // If no button found, just append to the container
      buttonsContainer.appendChild(button);
      buttonAdded = true;
      console.log('Comment generation button added to container');
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
  function generateComment() {
    // Show loading indicator
    const button = document.querySelector('.ai-comment-generator-btn');
    if (!button) return;

    const originalText = button.textContent;
    button.textContent = '⏳ Generating...';
    button.disabled = true;

    // Get the video title
    const videoTitle = getVideoTitle();
    console.log('Video title:', videoTitle);

    // Get settings
    console.log('Getting settings for comment generation...');

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
      return provider === 'openai' ? 'gpt-4o-mini' : 'mistral-small-latest';
    }

    chrome.storage.sync.get(defaultOptions, function(options) {
      try {
        console.log('Retrieved settings:', options);

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

        // Add video title to the prompt
        if (options.prompt) {
          options.prompt = `${options.prompt} Video title: "${videoTitle}"`;
          console.log('Updated prompt with video title:', options.prompt);
        }

        if (!options.apiKey) {
          alert('Please add an API key in the extension settings');
          button.textContent = originalText;
          button.disabled = false;
          return;
        }

      // Send request to generate a comment
      chrome.runtime.sendMessage(
        {
          action: 'generateComment',
          options: options
        },
        function(response) {
          if (button) {
            button.textContent = originalText;
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
              console.log('Found comment input field:', commentInput);
              commentInput.textContent = response.comment;
              commentInput.dispatchEvent(new Event('input', { bubbles: true }));

              // Focus on the input field
              commentInput.focus();
              console.log('Comment inserted successfully');
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
          button.textContent = originalText;
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
    console.log('Setting up comment focus listener...');

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
          console.log('Comment input focused, adding button...');
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
        console.log('Stopping periodic check for buttons container');
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
