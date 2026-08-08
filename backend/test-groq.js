require('dotenv').config();
const apiKey = process.env.GROQ_API_KEY;

async function testStructuredGroq() {
  if (!apiKey) {
    console.error('GROQ_API_KEY is not set in .env');
    return;
  }
  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are a helpful assistant. You must respond with a JSON object containing "hello" and "world" keys.' },
          { role: 'user', content: 'Say hello!' }
        ],
        response_format: {
          type: 'json_object'
        },
        max_tokens: 50
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
testStructuredGroq();
