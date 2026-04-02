// Get references to the DOM elements
const chatForm = document.getElementById('chatForm');
const userInput = document.getElementById('userInput');
const responseContainer = document.getElementById('response');

const messages = [
  {
    role: 'system',
    content: `You are a friendly Budget Travel Planner, specializing in cost-conscious travel advice. You help users find cheap flights, budget-friendly accommodations, affordable itineraries, and low-cost activities in their chosen destination.

    If a user's query is unrelated to budget travel, respond by stating that you do not know.`
  }
];

chatForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const prompt = userInput.value.trim();
  if (!prompt) return;
  userInput.value = '';

  console.log('User prompt:', prompt);
  messages.push({ role: 'user', content: prompt });
  console.log('Messages count after user push:', messages.length);

  responseContainer.textContent = 'Thinking...';

  try {
    // Send a POST request to the OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST', // We are POST-ing data to the API
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
        'Authorization': `Bearer ${apiKey}` // Include the API key for authorization
      },
      // Send model details and system message
      body: JSON.stringify({
        model: 'gpt-4o',
        messages
      })
    });

    // Parse and render response data on the page
    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content || 'No response received.';
    console.log('Assistant response:', content);
    messages.push({ role: 'assistant', content });
    console.log('Messages count after assistant push:', messages.length);
    responseContainer.textContent = content;
  } catch (error) {
    // Remove the last user message if request fails so history stays consistent.
    messages.pop();
    responseContainer.textContent = 'Something went wrong. Please try again.';
  }
});
