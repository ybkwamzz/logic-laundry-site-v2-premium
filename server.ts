import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GenAI client lazily to avoid startup crashes if key is initially absent
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in your environment variables. Please configure it in Settings > Secrets.');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// AI Assistant Chat route
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, selectedTheme } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid message request' });
    }

    // Attempt to lazily acquire GenAI client
    let ai;
    try {
      ai = getGenAI();
    } catch (apiError: any) {
      console.warn('Gemini API key missing:', apiError.message);
      return res.status(200).json({
        reply: "Hi from Logic Laundry Assistant! 👋 It looks like the Gemini API key isn't configured in this environment yet. To activate me, please head over to the **Settings > Secrets** panel in AI Studio and add `GEMINI_API_KEY`. \n\nIn the meantime, feel free to book a pickup through our scheduling widget below or try switching versions! I'm ready to keep your clothes absolutely sparkling."
      });
    }

    // Structure conversation history for Gemini
    // Get last few messages for context
    const history = messages.slice(-10).map((msg: any) => {
      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      };
    });

    const systemInstruction = `You are "Safi", the witty, extremely professional, and slightly satirical AI Virtual Assistant for "Logic Laundry Services" in Nairobi, Kenya.
Your personality is: helpful, highly knowledgeable about fabric care and stains, prompt, and local (referencing Nairobi estates like Kileleshwa, Westlands, Kasarani, Kilimani, Lavington, South B, etc.). 
You often use mild laundry-related humor and light Nairobi slang or Swahili integrations when appropriate (e.g. "Safi sana!", "Dobi wetu ni wa kisasa", "No more dirty laundry stress").

Logic Laundry Services key details:
- Baseline Pricing: KSH 80 per Kilo (Wash + Dry + Military-precise Fold).
- Express Service: KSH 120 per Kilo (Ready in 6 hours, priority same-day delivery).
- Bedding Set: KSH 500 per set (sheets, pillowcases, duvet cover deep cleaned).
- Curtains: KSH 300 per pair (washed, stain pre-treated, pressed).
- Ironing: KSH 30 per item.
- Minimun Order: 3kg. Free pickup and delivery on orders above KSH 500!
- Guarantee: 48-Hour Freshness Guarantee (or next wash is completely on us!).
- Eco-friendly initiatives: Biodegradable and skin-safe detergents.
- Contact: Phone (+254 700 000 000), WhatsApp quick-order available.
- Real-time order tracking: Currently under active development ("Coming Soon").

Active client UI context: The user is currently viewing the website in "${selectedTheme || 'Minimal Premium'}" style.
Keep your responses relatively brief (2-3 paragraphs max), engaging, conversational, and direct the user to the "Book Pickup" scheduler to set their appointment.
If they ask about stains (e.g. coffee, red wine, grass), give them clever, scientifically correct home pre-treatment tips (like white vinegar or baking soda) while reminding them that Logic Laundry's professional stain-busting team handles it even better.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: history,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error generating AI response:', error);
    res.status(500).json({ error: 'Failed to process chat query from AI.' });
  }
});

// Configure Vite or Static server
async function initServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Dynamic import for Vite inside dev environment
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite dev middleware loaded.');
  } else {
    // Production static delivery
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Production static middleware loaded for path:', distPath);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express custom server running at http://localhost:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('Failed to initialize full-stack server container:', err);
});
