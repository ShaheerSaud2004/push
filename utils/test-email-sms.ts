// Test utility for email-to-SMS functionality
// Use this in your React Native app to test

import { Linking, Alert, Platform } from 'react-native';
import { createEmailSMSMessage, getSupportedCarriers } from './email-sms';

export async function testEmailSMS(phoneNumber: string, carrier: string = 'att') {
  const testMessage = '🎮 Test from Muslim Imposter!\n\nThis is a test message sent via email-to-SMS. If you receive this, it works!';
  
  try {
    const emailData = createEmailSMSMessage(phoneNumber, testMessage, carrier);
    
    // Create mailto URL
    const mailtoUrl = `mailto:${emailData.to}?body=${encodeURIComponent(emailData.body)}`;
    
    // Open email app
    const canOpen = await Linking.canOpenURL(mailtoUrl);
    
    if (canOpen) {
      await Linking.openURL(mailtoUrl);
      Alert.alert(
        'Email App Opened',
        `Check your email app. The message is ready to send to:\n\n${emailData.to}\n\nTap send to test!`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Error', 'Could not open email app. Make sure you have an email app installed.');
    }
  } catch (error) {
    Alert.alert('Error', `Failed to create email: ${error}`);
  }
}

// Quick test function you can call from anywhere
export function quickTest() {
  const testNumber = '7323148699'; // Your test number
  const carrier = 'att'; // Try AT&T first, then verizon, tmobile, etc.
  
  testEmailSMS(testNumber, carrier);
}
