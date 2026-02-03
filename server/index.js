// Simple Express server for sending SMS via Textbelt
// Run with: node server/index.js
// Or: npm start (if you add it to package.json scripts)

const express = require('express');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Textbelt API configuration
const TEXTBELT_API_KEY = process.env.TEXTBELT_API_KEY || '160ddf869a93a4068104fd2202e628f4f98e36b112K8y0z3LRb3wwMhyewijMOyr';
const TEXTBELT_API_URL = 'textbelt.com';
const TEXTBELT_API_PATH = '/text';

// Middleware
app.use(express.json());

// CORS - Allow requests from your mobile app
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Helper function to send SMS via Textbelt
function sendTextbeltSMS(phoneNumber, message) {
  return new Promise((resolve, reject) => {
    // Format phone number (ensure it starts with +1 for US)
    let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    if (formattedPhone.length === 10) {
      formattedPhone = `+1${formattedPhone}`;
    } else if (formattedPhone.length === 11 && formattedPhone[0] === '1') {
      formattedPhone = `+${formattedPhone}`;
    } else if (!phoneNumber.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`;
    } else {
      formattedPhone = phoneNumber;
    }

    const postData = JSON.stringify({
      phone: formattedPhone,
      message: message,
      key: TEXTBELT_API_KEY,
    });

    const options = {
      hostname: TEXTBELT_API_URL,
      path: TEXTBELT_API_PATH,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.success) {
            resolve({
              success: true,
              messageId: response.textId || response.id,
              quotaRemaining: response.quotaRemaining,
            });
          } else {
            reject(new Error(response.error || 'Failed to send SMS'));
          }
        } catch (error) {
          reject(new Error(`Parse error: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// SMS endpoint
app.post('/api/send-sms', async (req, res) => {
  try {
    const { players, gameInfo } = req.body;

    if (!players || !Array.isArray(players)) {
      return res.status(400).json({ error: 'Players array is required' });
    }

    const results = [];

    // Send SMS to each player via Textbelt
    for (const player of players) {
      if (!player.phoneNumber || !player.message) {
        results.push({
          playerName: player.name,
          success: false,
          error: 'Missing phone number or message',
        });
        continue;
      }

      try {
        const response = await sendTextbeltSMS(player.phoneNumber, player.message);

        results.push({
          playerName: player.name,
          phoneNumber: player.phoneNumber,
          success: true,
          messageId: response.messageId,
          quotaRemaining: response.quotaRemaining,
        });
      } catch (error) {
        results.push({
          playerName: player.name,
          phoneNumber: player.phoneNumber,
          success: false,
          error: error.message,
        });
      }
    }

    res.json({
      success: true,
      results,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length,
    });
  } catch (error) {
    console.error('Error sending SMS:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'SMS API' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SMS API server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`\nTo test from your phone, use your computer's IP address:`);
  console.log(`Example: http://10.74.175.85:${PORT}/health`);
  console.log(`\nMake sure your phone and computer are on the same WiFi network!`);
});
