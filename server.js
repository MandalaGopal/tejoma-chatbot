const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

const systemPrompt = `You are the official AI assistant for Tejoma Technologies, a cybersecurity and GRC consulting firm.
You help customers with:
- Third Party Risk Management (TPRM)
- Cyber Risk Assessments
- Privacy Risk Assessments
- Compliance Readiness Audits
- IT Staffing & Resource Solutions
- Cybersecurity Consulting

Be professional, concise, and solution-oriented. Keep responses to 2-4 sentences unless more detail is needed.`;

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    
    const messages = [
      { role: 'user', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await axios.post(GROQ_API_URL, {
      model: 'llama-3.3-70b-versatile',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Tejoma Chatbot Backend running on port ${PORT}`);
});