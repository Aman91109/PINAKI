require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;
async function testOpenAI() {
  if (!apiKey) {
    console.error('OPENAI_API_KEY is not set in .env');
    return;
  }
  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "OpenAI API Key is active!"' }],
        max_tokens: 20
      })
    });
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}
testOpenAI();
