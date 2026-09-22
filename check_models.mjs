import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const keyLine = env.split('\n').find(line => line.startsWith('GROQ_API_KEY='));
const key = keyLine.split('=')[1].trim();

const res = await fetch('https://api.groq.com/openai/v1/models', {
  headers: {
    'Authorization': `Bearer ${key}`
  }
});
const data = await res.json();
console.log(data.data.map(m => m.id));
