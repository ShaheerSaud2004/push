// Send test SMS via email using Gmail
const nodemailer = require('nodemailer');

// Gmail configuration
const email = 'shaheersaud2004@gmail.com';
const appPassword = 'cvnx nvvt syex asjy'; // Remove spaces for app password
const phoneNumber = '7323148699';
const carrier = 'att'; // Try AT&T first

// Carrier gateways
const gateways = {
  att: '@txt.att.net',
  verizon: '@vtext.com',
  tmobile: '@tmomail.net',
  sprint: '@messaging.sprintpcs.com',
};

// Create email-to-SMS address
const smsEmail = `${phoneNumber}${gateways[carrier]}`;

// Test message
const message = `🎮 Test from Muslim Imposter!

This is a test message sent via email-to-SMS. If you receive this, it works!`;

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: email,
    pass: appPassword.replace(/\s/g, ''), // Remove spaces from app password
  },
});

// Send email
async function sendTestSMS() {
  try {
    console.log('📧 Sending test SMS via email...');
    console.log(`To: ${smsEmail}`);
    console.log(`From: ${email}`);
    console.log(`Message: ${message}\n`);

    const info = await transporter.sendMail({
      from: email,
      to: smsEmail,
      subject: '', // SMS doesn't use subject
      text: message,
    });

    console.log('✅ Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    console.log(`\n📱 The SMS should arrive at ${phoneNumber} within a few seconds.`);
    console.log(`\nIf it doesn't work, try a different carrier:`);
    Object.entries(gateways).forEach(([carrierName, gateway]) => {
      if (carrierName !== carrier) {
        console.log(`  - ${carrierName}: ${phoneNumber}${gateway}`);
      }
    });
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    if (error.code === 'EAUTH') {
      console.error('\n⚠️  Authentication failed. Check your app password.');
      console.error('Make sure you removed spaces from the app password.');
    }
  }
}

sendTestSMS();
