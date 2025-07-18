const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
const submitButton = form.querySelector('button');

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Disable form elements to prevent multiple submissions
  input.disabled = true;
  submitButton.disabled = true;

  // Show a thinking message
  const thinkingMsgElement = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: userMessage }),
    });

    if (!response.ok) {
      let errorText = `Server error: ${response.status} ${response.statusText}`;
      try {
        // Try to get a more specific error message from the API response
        const errorData = await response.json();
        errorText = errorData.reply || errorText;
      } catch (jsonError) {
        // The error response wasn't JSON. The original errorText is fine.
      }
      throw new Error(errorText);
    }

    const data = await response.json();
    // Update the thinking message with the actual reply
    thinkingMsgElement.textContent = data.reply;
  } catch (error) {
    console.error('Error fetching from API:', error);
    // Update the thinking message with an error
    thinkingMsgElement.textContent =
      error.message || 'Sorry, something went wrong. Please try again.';
  } finally {
    // Re-enable form elements and focus on input
    input.disabled = false;
    submitButton.disabled = false;
    input.focus();
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg; // Return the element to allow modification
}
