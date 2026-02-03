// Email-to-SMS utility - Send SMS via carrier email gateways (FREE!)

// Carrier email-to-SMS gateways
// Format: {phoneNumber}@{gateway}
const CARRIER_GATEWAYS: { [key: string]: string } = {
  // Major US carriers
  'att': '@txt.att.net',
  'verizon': '@vtext.com',
  'tmobile': '@tmomail.net',
  'sprint': '@messaging.sprintpcs.com',
  'uscellular': '@email.uscc.net',
  'cricket': '@sms.cricketwireless.net',
  'boost': '@sms.myboostmobile.com',
  'metropcs': '@mymetropcs.com',
  'virgin': '@vmobl.com',
  
  // Canadian carriers
  'rogers': '@pcs.rogers.com',
  'bell': '@txt.bell.ca',
  'telus': '@msg.telus.com',
  'fido': '@fido.ca',
  'virgin-canada': '@vmobile.ca',
  
  // UK carriers
  'vodafone-uk': '@vodafone-sms.co.uk',
  'o2-uk': '@o2.co.uk',
  'ee-uk': '@mms.ee.co.uk',
  'three-uk': '@three.co.uk',
  
  // Generic/International (may not work for all)
  'generic': '@sms.gateway', // This is a placeholder
};

// Detect carrier from phone number (basic detection)
// This is a simplified version - you might want to use a phone number lookup API
export function detectCarrier(phoneNumber: string): string | null {
  // Remove all non-digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  // US numbers starting with 1
  if (digits.length === 11 && digits[0] === '1') {
    const areaCode = digits.substring(1, 4);
    // You could add more sophisticated detection here
    // For now, return a common carrier or let user select
    return 'att'; // Default to AT&T
  }
  
  // 10-digit US numbers
  if (digits.length === 10) {
    return 'att'; // Default
  }
  
  // Canadian numbers
  if (digits.length === 11 && digits[0] === '1') {
    return 'rogers'; // Default Canadian
  }
  
  return null;
}

// Format phone number for email gateway
export function formatPhoneForEmail(phoneNumber: string, carrier?: string): string {
  // Remove all non-digits
  const digits = phoneNumber.replace(/\D/g, '');
  
  // Remove country code if present (assuming +1 for US/Canada)
  let phoneDigits = digits;
  if (digits.length === 11 && digits[0] === '1') {
    phoneDigits = digits.substring(1);
  }
  
  // Get carrier gateway
  const selectedCarrier = carrier || detectCarrier(phoneNumber) || 'att';
  const gateway = CARRIER_GATEWAYS[selectedCarrier] || CARRIER_GATEWAYS['att'];
  
  // Format: 1234567890@txt.att.net
  return `${phoneDigits}${gateway}`;
}

// Send SMS via email (using device's email app)
// This opens the native email app with pre-filled recipient and message
export function createEmailSMSMessage(
  phoneNumber: string,
  message: string,
  carrier?: string
): { to: string; subject: string; body: string } {
  const emailAddress = formatPhoneForEmail(phoneNumber, carrier);
  
  return {
    to: emailAddress,
    subject: '', // SMS doesn't use subject
    body: message,
  };
}

// Get list of supported carriers for user selection
export function getSupportedCarriers(): Array<{ key: string; name: string; gateway: string }> {
  return [
    { key: 'att', name: 'AT&T', gateway: CARRIER_GATEWAYS['att'] },
    { key: 'verizon', name: 'Verizon', gateway: CARRIER_GATEWAYS['verizon'] },
    { key: 'tmobile', name: 'T-Mobile', gateway: CARRIER_GATEWAYS['tmobile'] },
    { key: 'sprint', name: 'Sprint', gateway: CARRIER_GATEWAYS['sprint'] },
    { key: 'uscellular', name: 'US Cellular', gateway: CARRIER_GATEWAYS['uscellular'] },
    { key: 'cricket', name: 'Cricket', gateway: CARRIER_GATEWAYS['cricket'] },
    { key: 'boost', name: 'Boost Mobile', gateway: CARRIER_GATEWAYS['boost'] },
    { key: 'metropcs', name: 'MetroPCS', gateway: CARRIER_GATEWAYS['metropcs'] },
    { key: 'virgin', name: 'Virgin Mobile', gateway: CARRIER_GATEWAYS['virgin'] },
    { key: 'rogers', name: 'Rogers (Canada)', gateway: CARRIER_GATEWAYS['rogers'] },
    { key: 'bell', name: 'Bell (Canada)', gateway: CARRIER_GATEWAYS['bell'] },
    { key: 'telus', name: 'Telus (Canada)', gateway: CARRIER_GATEWAYS['telus'] },
  ];
}

// Format game card message for SMS
export function formatGameCardMessage(
  playerName: string,
  word: string,
  category: string,
  role: 'imposter' | 'not-imposter' | 'double-agent',
  mode: 'word' | 'quiz',
  blindImposter: boolean,
  doubleAgent: boolean
): string {
  let message = `🎮 Muslim Imposter Game Card\n\n`;
  message += `Player: ${playerName}\n`;
  message += `Word: ${word}\n`;
  message += `Category: ${category}\n\n`;

  if (role === 'double-agent') {
    message += `Role: DOUBLE AGENT\n`;
    message += `You know the secret word!\n`;
  } else if (role === 'imposter') {
    message += `Role: IMPOSTER\n`;
    if (blindImposter) {
      message += `You do NOT know the word or category.\n`;
    } else {
      message += `You do NOT know the word.\n`;
    }
  } else {
    message += `Role: NOT IMPOSTER\n`;
    message += `You know the word!\n`;
  }

  if (mode === 'quiz') {
    message += `\nMode: Quiz Mode`;
  }

  return message;
}
