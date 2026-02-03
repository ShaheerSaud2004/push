// SMS utility functions for sending game cards via Twilio

export interface SMSPlayer {
  name: string;
  phoneNumber: string;
  message: string;
}

export interface SMSRequest {
  players: SMSPlayer[];
  gameInfo: {
    word: string;
    category: string;
    mode: string;
  };
}

export interface SMSResponse {
  success: boolean;
  results: Array<{
    playerName: string;
    phoneNumber?: string;
    success: boolean;
    messageId?: string;
    messageSid?: string; // Legacy Twilio field
    quotaRemaining?: number;
    error?: string;
  }>;
  totalSent: number;
  totalFailed: number;
}

// Format game card message for SMS
export function formatGameCardMessage(
  playerName: string,
  word: string,
  category: string,
  role: 'imposter' | 'not-imposter' | 'double-agent',
  mode: 'word' | 'quiz',
  blindImposter: boolean,
  doubleAgent: boolean,
  showCategoryToImposter: boolean,
  quizQuestion?: string
): string {
  let message = `🎮 Muslim Imposter Game Card\n\n`;
  message += `Hi ${playerName}!\n\n`;

  if (role === 'double-agent') {
    // Double Agent knows the word
    message += `Role: DOUBLE AGENT\n\n`;
    message += `Word: ${word}\n`;
    message += `Category: ${category}\n\n`;
    message += `You know the secret word! Your goal is to survive without being voted out while making it seem like you might be the imposter.\n`;
  } else if (role === 'imposter') {
    // Imposter should NOT see the word - make this very clear
    message += `Role: IMPOSTER ⚠️\n\n`;
    if (blindImposter) {
      // Blind Imposter doesn't see word OR category
      message += `You do NOT know the secret word or category.\n`;
      message += `Your goal: Blend in and avoid being voted out!\n`;
      message += `Listen carefully to other players' clues to figure out what they might be talking about.\n`;
    } else {
      // Regular Imposter doesn't see word, but may see category
      if (showCategoryToImposter) {
        message += `Category: ${category}\n`;
        message += `You do NOT know the secret word.\n\n`;
        message += `Your goal: Blend in and avoid being voted out!\n`;
        message += `Use the category to help you give believable clues.\n`;
      } else {
        message += `You do NOT know the secret word.\n\n`;
        message += `Your goal: Blend in and avoid being voted out!\n`;
        message += `Listen carefully to other players' clues to figure out what they might be talking about.\n`;
      }
    }
  } else {
    // Normal player sees everything
    message += `Role: NOT IMPOSTER\n\n`;
    message += `Word: ${word}\n`;
    message += `Category: ${category}\n\n`;
    message += `You know the secret word! Your goal: Find the imposter(s)!\n`;
  }

  message += `\n---\n`;

  if (mode === 'quiz' && quizQuestion) {
    message += `Mode: Quiz Mode\n\n`;
    message += `Question: ${quizQuestion}\n\n`;
    message += `First, determine the answer to this question. The answer is the secret word.\n`;
    if (role === 'imposter') {
      message += `You don't know the answer, so you must guess and give clues based on your guess.\n`;
    } else {
      message += `Then give ONE clue word related to that answer.\n`;
    }
  } else {
    message += `Mode: Word + Clue\n`;
    message += `Each player gives ONE clue word related to the secret word. Go around the group until everyone has given a clue.\n`;
  }

  message += `\nGood luck! 🎯`;

  return message;
}

// Send SMS via backend API
export async function sendGameCardsViaSMS(
  apiUrl: string,
  request: SMSRequest
): Promise<SMSResponse> {
  try {
    // Create timeout controller for health check
    const healthController = new AbortController();
    const healthTimeout = setTimeout(() => healthController.abort(), 5000);

    // Test connection first
    try {
      const healthCheck = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: healthController.signal,
      });
      clearTimeout(healthTimeout);
      if (!healthCheck.ok) {
        throw new Error('Server is not responding. Make sure the SMS server is running.');
      }
    } catch (healthError) {
      clearTimeout(healthTimeout);
      if (healthError instanceof Error && healthError.name === 'AbortError') {
        throw new Error('Connection timeout. Make sure the SMS server is running and your phone is on the same WiFi network.');
      }
      throw new Error('Cannot connect to SMS server. Make sure the server is running at ' + apiUrl);
    }

    // Create timeout controller for SMS request
    const smsController = new AbortController();
    const smsTimeout = setTimeout(() => smsController.abort(), 30000);

    const response = await fetch(`${apiUrl}/api/send-sms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      signal: smsController.signal,
    });

    clearTimeout(smsTimeout);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data: SMSResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending SMS:', error);
    if (error instanceof Error) {
      // Provide more helpful error messages
      if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch') || error.name === 'AbortError') {
        throw new Error('Network request failed. Make sure:\n1. SMS server is running (cd server && npm start)\n2. Your phone and computer are on the same WiFi\n3. Server URL is correct: ' + apiUrl);
      }
      throw error;
    }
    throw new Error('Unknown error occurred while sending SMS');
  }
}

// Validate phone number format (basic validation)
export function validatePhoneNumber(phone: string): boolean {
  // Remove all non-digit characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Must start with + and have 10-15 digits after country code
  // Basic format: +1234567890 (E.164 format)
  const phoneRegex = /^\+[1-9]\d{10,14}$/;
  
  return phoneRegex.test(cleaned);
}

// Format phone number for display (adds formatting)
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If starts with 1 (US), format as (XXX) XXX-XXXX
  if (digits.length === 11 && digits[0] === '1') {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  
  // If 10 digits, assume US number
  if (digits.length === 10) {
    return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  // Otherwise, just ensure it starts with +
  if (!phone.startsWith('+')) {
    return `+${digits}`;
  }
  
  return phone;
}
