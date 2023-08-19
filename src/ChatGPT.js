import axios from 'axios';

async function getChatGPTResponse(promptText) {
  const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'; // this endpoint might change depending on OpenAI's documentation
  const API_KEY = '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'; // replace with your OpenAI API key
  const ORG_KEY = 'org-lNKLoHVe60pOjy4RBnctEeEx';
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
    'OpenAI-Organization': `${ORG_KEY}`
  };

  console.log("================================");
  console.log("headers=" + headers);
  console.log("================================");
  
  const data = {
     "model": "gpt-3.5-turbo",
     "messages": [{"role": "user", "content": "Say this is a test!"}],
     "temperature": 0.7,
     "max_tokens": 150
  };

  try {
    const response = await axios.post(API_ENDPOINT, data, { headers: headers });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error calling the ChatGPT API:', error);
    throw error;
  }
}

// Example usage:
(async () => {
  try {
    const responseText = await getChatGPTResponse('What is the capital of France?');
    console.log(responseText);
  } catch (error) {
    console.error('Failed to get a response:', error);
  }
})();
