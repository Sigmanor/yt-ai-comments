document.addEventListener('DOMContentLoaded', function() {
  // Open settings page when button is clicked
  document.getElementById('options-btn').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });

  // Check if a YouTube tab is open
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];

    // Check the tab URL
    const isYouTube = currentTab.url.includes('youtube.com');

    // Update text in popup
    const statusElement = document.createElement('p');
    statusElement.id = 'status';

    if (isYouTube) {
      statusElement.textContent = 'You are on YouTube! The comment generation button is available in the comment field.';
      statusElement.className = 'success';
    } else {
      statusElement.textContent = 'You are not on YouTube. Go to YouTube to use this extension.';
      statusElement.className = 'error';
    }

    // Add status to popup
    const container = document.querySelector('.container');

    // Remove previous status if it exists
    const existingStatus = document.getElementById('status');
    if (existingStatus) {
      existingStatus.remove();
    }

    container.insertBefore(statusElement, document.getElementById('options-btn'));
  });
});
