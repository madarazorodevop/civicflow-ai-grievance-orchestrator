const fetch = require('node-fetch');
async function run() {
  const messages = [
    { role: 'system', content: 'You are CivicBot...' },
    { role: 'assistant', content: 'Hello!' },
    { role: 'user', content: 'What is Chennai corporation?' }
  ];
  try {
    const res = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model: 'openai' })
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Response:", text);
  } catch (e) {
    console.error(e);
  }
}
run();
