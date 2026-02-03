// Quick test script for email-to-SMS
// Run with: node test-email-sms.js

const phoneNumber = '7323148699'; // Your test number (no dashes/spaces)
const testMessage = '🎮 Test from Muslim Imposter!\n\nThis is a test message sent via email-to-SMS.';

// Common carrier gateways for US
const carriers = {
  att: '@txt.att.net',
  verizon: '@vtext.com',
  tmobile: '@tmomail.net',
  sprint: '@messaging.sprintpcs.com',
  uscellular: '@email.uscc.net',
  cricket: '@sms.cricketwireless.net',
};

// Format: 7323148699@txt.att.net
console.log('\n📱 Email-to-SMS Test for: ' + phoneNumber);
console.log('=====================================\n');

console.log('Test Message:');
console.log(testMessage);
console.log('\n');

console.log('Email addresses to try (pick the carrier):\n');
Object.entries(carriers).forEach(([carrier, gateway]) => {
  console.log(`${carrier.toUpperCase()}: ${phoneNumber}${gateway}`);
});

console.log('\n📧 To test:');
console.log('1. Open your email app');
console.log('2. Create new email');
console.log('3. To: Use one of the addresses above (try AT&T first)');
console.log('4. Subject: (leave blank or put "Test")');
console.log('5. Body: Copy the test message above');
console.log('6. Send!');
console.log('\n✅ If it works, the person will receive an SMS!');
console.log('❌ If it doesn\'t work, try a different carrier gateway.\n');

// Generate mailto link for easy testing
const mailtoLink = `mailto:${phoneNumber}@txt.att.net?body=${encodeURIComponent(testMessage)}`;
console.log('🔗 Quick test link (AT&T):');
console.log(mailtoLink);
console.log('\n(Copy and paste this into your browser to test)\n');
