# SMS Server Setup (Textbelt)

## Quick Start

1. **Install dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Textbelt API key:
   - `TEXTBELT_API_KEY` - Your Textbelt API key
   
   **Note:** The API key is already configured in the code as a fallback. For production, use environment variables.

3. **Start the server:**
   ```bash
   npm start
   ```
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Test the health endpoint:**
   Open: http://localhost:3000/health

## Testing

Test the Textbelt API directly:
```bash
node ../test-textbelt.js
```

## Deploying

You can deploy this to:
- **Heroku** (free tier available)
- **Vercel** (serverless functions)
- **Railway** (easy deployment)
- **Render** (free tier available)

Make sure to set the `TEXTBELT_API_KEY` environment variable in your hosting platform!

## API Endpoint

**POST** `/api/send-sms`

**Request Body:**
```json
{
  "players": [
    {
      "name": "Player 1",
      "phoneNumber": "+1234567890",
      "message": "Your game card message here"
    }
  ],
  "gameInfo": {
    "word": "Example",
    "category": "Category Name"
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "playerName": "Player 1",
      "phoneNumber": "+1234567890",
      "success": true,
      "messageId": "44271769623053610",
      "quotaRemaining": 48
    }
  ],
  "totalSent": 1,
  "totalFailed": 0
}
```
