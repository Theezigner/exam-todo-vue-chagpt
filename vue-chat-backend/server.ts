// vue-chat-backend/server.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import 'dotenv/config'; // Modern way to load environment variables
import { OpenAI } from 'openai';

// Define a type for the chat history message to match the frontend structure
interface ChatMessage {
    id: number;
    content: string;
    isUser: boolean; // true for user, false for AI
}

// Define the shape of the request body coming from the Vue app
interface ChatRequest extends Request {
    body: {
        message: string;
        history: ChatMessage[];
    };
}

// Initialize OpenAI with your secret key from the .env file
// The process.env variable is typed as string | undefined, so we assert it exists
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set in the .env file.");
}
const openai = new OpenAI({ apiKey });

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// The secure chat endpoint
app.post('/api/chat', async (req: ChatRequest, res: Response) => {
    // TypeScript now enforces that req.body has 'message' and 'history'
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
      // Construct the messages array for the OpenAI API, mapping from our custom ChatMessage type
      const messages = history.map((msg) => ({
        role: msg.isUser ? ("user" as const) : ("assistant" as const), // 'as const' enforces specific string literal types
        content: msg.content,
      }));

      // Add the new user message
      messages.push({ role: "user" as const, content: message });

      // Call the OpenAI API securely
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      const aiResponse = completion.choices[0].message.content;

      // Send the AI response back to the Vue client
      res.json({ answer: aiResponse });
    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ error: 'Failed to get response from AI.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running securely (TS) at http://localhost:${PORT}`);
});