require('dotenv').config();
const http = require('http');

const postData = JSON.stringify({
  name: 'Aman Singh',
  email: 'aman.test@example.com',
  phone: '+91 9876543210',
  company: 'Freelance Studio',
  budget: '₹1,00,000 – ₹3,00,000',
  projectType: 'Web application',
  message: 'Hi Pinaki, I need a modern portfolio website with CMS dashboard. Looking forward to working together!',
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/public/lead',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const startTime = Date.now();
const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const duration = Date.now() - startTime;
    console.log('Status:', res.statusCode);
    console.log('Response Time:', duration + 'ms');
    console.log('Response:', JSON.stringify(JSON.parse(data), null, 2));
  });
});

req.on('error', (e) => {
  console.error('Request error:', e.message);
});

req.write(postData);
req.end();

