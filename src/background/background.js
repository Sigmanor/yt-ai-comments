// Background script for processing API requests

// Message handler from content script
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  console.log('Background script received message:', request);

  if (request.action === 'generateComment') {
    console.log('Generating comment with options:', request.options);

    generateComment(request.options)
      .then(comment => {
        // Remove quotes if they wrap the entire comment
        let processedComment = comment;

        // Check if the comment starts and ends with quotes
        if (processedComment.startsWith('"') && processedComment.endsWith('"')) {
          console.log('Comment has surrounding quotes, removing them');
          processedComment = processedComment.substring(1, processedComment.length - 1);
        }

        // Also check for single quotes
        if (processedComment.startsWith('\'') && processedComment.endsWith('\'')) {
          console.log('Comment has surrounding single quotes, removing them');
          processedComment = processedComment.substring(1, processedComment.length - 1);
        }

        console.log('Comment generated successfully:', processedComment.substring(0, 50) + '...');
        sendResponse({ success: true, comment: processedComment });
      })
      .catch(error => {
        console.error('Error generating comment:', error);
        sendResponse({ success: false, error: error.message });
      });
    return true; // Return true for asynchronous response
  }
});

// Function to generate a comment via API
async function generateComment(options) {
  const { provider, apiKey, prompt, language, model, maxTokens, temperature } = options;

  console.log('Generate comment function called with:', {
    provider,
    language,
    model,
    maxTokens,
    temperature,
    promptLength: prompt?.length
  });

  try {
    if (provider === 'openai') {
      console.log('Using OpenAI provider');
      return await generateWithOpenAI(apiKey, prompt, language, model, maxTokens, temperature);
    } else if (provider === 'mistralai') {
      console.log('Using MistralAI provider');
      return await generateWithMistralAI(apiKey, prompt, language, model, maxTokens, temperature);
    } else {
      throw new Error('Unknown AI provider: ' + provider);
    }
  } catch (error) {
    console.error('Comment generation error:', error);
    throw error;
  }
}

// Function to generate a comment via OpenAI API
async function generateWithOpenAI(apiKey, prompt, language, model, maxTokens, temperature) {
  // Use default values if not provided
  const modelToUse = model || 'gpt-4o-mini';
  const maxTokensToUse = maxTokens || 2000;
  const temperatureToUse = temperature !== undefined ? temperature : 0.5;

  console.log('OpenAI API call with:', {
    model: modelToUse,
    maxTokens: maxTokensToUse,
    temperature: temperatureToUse,
    language: language
  });

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: `You are an assistant that writes comments for YouTube. Write in ${getLanguageName(language)}. Consider the video title when writing your comment. Do not use quotation marks around your response. Just write the comment directly.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokensToUse,
        temperature: temperatureToUse
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error response:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    let comment = data.choices[0].message.content.trim();
    console.log('OpenAI API success, response length:', comment.length);

    // Remove quotes if they wrap the entire comment
    if (comment.startsWith('"') && comment.endsWith('"')) {
      console.log('OpenAI comment has surrounding quotes, removing them');
      comment = comment.substring(1, comment.length - 1);
    }

    // Also check for single quotes
    if (comment.startsWith('\'') && comment.endsWith('\'')) {
      console.log('OpenAI comment has surrounding single quotes, removing them');
      comment = comment.substring(1, comment.length - 1);
    }

    return comment;
  } catch (error) {
    console.error('Error in OpenAI API call:', error);
    throw error;
  }
}

// Function to generate a comment via MistralAI API
async function generateWithMistralAI(apiKey, prompt, language, model, maxTokens, temperature) {
  // Use default values if not provided
  const modelToUse = model || 'mistral-small-latest';
  const maxTokensToUse = maxTokens || 2000;
  const temperatureToUse = temperature !== undefined ? temperature : 0.5;

  console.log('MistralAI API call with:', {
    model: modelToUse,
    maxTokens: maxTokensToUse,
    temperature: temperatureToUse,
    language: language
  });

  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelToUse,
        messages: [
          {
            role: 'system',
            content: `You are an assistant that writes comments for YouTube. Write in ${getLanguageName(language)}. Consider the video title when writing your comment. Do not use quotation marks around your response. Just write the comment directly.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokensToUse,
        temperature: temperatureToUse
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('MistralAI API error response:', error);
      throw new Error(`MistralAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    let comment = data.choices[0].message.content.trim();
    console.log('MistralAI API success, response length:', comment.length);

    // Remove quotes if they wrap the entire comment
    if (comment.startsWith('"') && comment.endsWith('"')) {
      console.log('MistralAI comment has surrounding quotes, removing them');
      comment = comment.substring(1, comment.length - 1);
    }

    // Also check for single quotes
    if (comment.startsWith('\'') && comment.endsWith('\'')) {
      console.log('MistralAI comment has surrounding single quotes, removing them');
      comment = comment.substring(1, comment.length - 1);
    }

    return comment;
  } catch (error) {
    console.error('Error in MistralAI API call:', error);
    throw error;
  }
}

// Function to get language name by code
function getLanguageName(code) {
  const languages = {
    'uk': 'Ukrainian',
    'en': 'English',
    'pl': 'Polish',
    'de': 'German',
    'fr': 'French'
  };

  return languages[code] || 'English';
}
