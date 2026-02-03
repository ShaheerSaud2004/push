// Test script for Textbelt SMS API
const https = require('https');

const TEXTBELT_API_KEY = '160ddf869a93a4068104fd2202e628f4f98e36b112K8y0z3LRb3wwMhyewijMOyr';
const TEST_PHONE = '7323148699'; // Your test number without + or formatting

const testMessage = {
  phone: `+1${TEST_PHONE}`, // Textbelt requires +1 for US numbers
  message: '🎮 Muslim Imposter Test\n\nThis is a test message from Textbelt API!',
  key: TEXTBELT_API_KEY,
};

const postData = JSON.stringify(testMessage);

const options = {
  hostname: 'textbelt.com',
  path: '/text',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

console.log('Testing Textbelt API...');
console.log('Sending to:', testMessage.phone);
console.log('Message:', testMessage.message);
console.log('\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response Status:', res.statusCode);
      console.log('Response:', JSON.stringify(response, null, 2));
      
      if (response.success) {
        console.log('\n✅ SUCCESS! Message sent successfully!');
        console.log('Quota remaining:', response.quotaRemaining || 'N/A');
      } else {
        console.log('\n❌ FAILED:', response.error || 'Unknown error');
      }
    } catch (error) {
      console.log('Raw response:', data);
      console.error('Error parsing response:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error.message);
});

req.write(postData);
req.end();
