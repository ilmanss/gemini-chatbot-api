const express = require('express'); 
const cors = require('cors'); 
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();
 
// Add a check for the API key to provide a clear error message if it's missing.
if (!process.env.GEMINI_API_KEY) {
  console.error('Error: GEMINI_API_KEY is not defined. Make sure you have a .env file with GEMINI_API_KEY="your-api-key"');
  process.exit(1);
}
 
const app = express();
const port = process.env.PORT || 3000;

// Middleware 
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); 
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.listen(port, () => {
console.log(`Gemini Chatbot running on http://localhost:${port}`);
    });


// Route penting!
app.post('/api/chat', async (req, res) => {
const userMessage = req.body.message;

if (!userMessage) {
return res.status(400).json({ reply: "Message is required." });
}

try {
const result = await model.generateContent (userMessage); 
const response = await result.response;
const text = response.text();

res.json({reply: text });
} catch (err) {
console.error(err);
res.status(500).json({ reply: "Something went wrong." });
}
});