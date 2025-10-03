const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const router = express.Router();

// AI Provider configurations
const AI_PROVIDERS = {
  claude: {
    url: 'https://api.anthropic.com/v1/messages',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    formatRequest: (messages, model = 'claude-3-sonnet-20240229') => ({
      model,
      max_tokens: 4000,
      messages: messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))
    }),
    formatResponse: (data) => ({
      content: data.content[0].text,
      usage: data.usage
    })
  },
  gemini: {
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    headers: {
      'Content-Type': 'application/json'
    },
    formatRequest: (messages) => ({
      contents: messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }))
    }),
    formatResponse: (data) => ({
      content: data.candidates[0].content.parts[0].text,
      usage: data.usageMetadata
    })
  },
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    formatRequest: (messages, model = 'mixtral-8x7b-32768') => ({
      model,
      messages,
      max_tokens: 4000,
      temperature: 0.7
    }),
    formatResponse: (data) => ({
      content: data.choices[0].message.content,
      usage: data.usage
    })
  },
  xai: {
    url: 'https://api.x.ai/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.XAI_API_KEY}`
    },
    formatRequest: (messages, model = 'grok-beta') => ({
      model,
      messages,
      max_tokens: 4000,
      temperature: 0.7
    }),
    formatResponse: (data) => ({
      content: data.choices[0].message.content,
      usage: data.usage
    })
  },
  openai: {
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    formatRequest: (messages, model = 'gpt-4') => ({
      model,
      messages,
      max_tokens: 4000,
      temperature: 0.7
    }),
    formatResponse: (data) => ({
      content: data.choices[0].message.content,
      usage: data.usage
    })
  }
};

// Chat completion endpoint
router.post('/chat', async (req, res) => {
  try {
    const { messages, provider = 'claude', model, stream = false } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const providerConfig = AI_PROVIDERS[provider];
    if (!providerConfig) {
      return res.status(400).json({ error: 'Invalid AI provider' });
    }

    const requestData = providerConfig.formatRequest(messages, model);

    if (stream) {
      // Handle streaming response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      try {
        const response = await axios.post(providerConfig.url, {
          ...requestData,
          stream: true
        }, {
          headers: providerConfig.headers,
          responseType: 'stream'
        });

        response.data.on('data', (chunk) => {
          const lines = chunk.toString().split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data.trim() === '[DONE]') {
                res.write('data: [DONE]\n\n');
                res.end();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                res.write(`data: ${JSON.stringify(parsed)}\n\n`);
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        });

        response.data.on('end', () => {
          res.end();
        });

      } catch (error) {
        res.write(`data: ${JSON.stringify({ error: 'Streaming error' })}\n\n`);
        res.end();
      }
    } else {
      // Handle regular response
      const response = await axios.post(providerConfig.url, requestData, {
        headers: providerConfig.headers
      });

      const formattedResponse = providerConfig.formatResponse(response.data);
      
      res.json({
        success: true,
        provider,
        model: model || 'default',
        response: formattedResponse.content,
        usage: formattedResponse.usage,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'AI service error',
      details: error.response?.data?.error || error.message,
      provider: req.body.provider || 'unknown'
    });
  }
});

// Get available models for a provider
router.get('/models/:provider', (req, res) => {
  const { provider } = req.params;
  
  const models = {
    claude: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
    gemini: ['gemini-pro', 'gemini-pro-vision'],
    groq: ['mixtral-8x7b-32768', 'llama2-70b-4096', 'gemma-7b-it'],
    xai: ['grok-beta'],
    openai: ['gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo']
  };

  if (!models[provider]) {
    return res.status(400).json({ error: 'Invalid provider' });
  }

  res.json({
    provider,
    models: models[provider]
  });
});

// Health check for AI providers
router.get('/health', async (req, res) => {
  const healthStatus = {};

  for (const [provider, config] of Object.entries(AI_PROVIDERS)) {
    try {
      // Simple health check - just verify API key exists
      const hasApiKey = process.env[`${provider.toUpperCase()}_API_KEY`] !== undefined;
      healthStatus[provider] = {
        status: hasApiKey ? 'available' : 'missing_key',
        configured: hasApiKey
      };
    } catch (error) {
      healthStatus[provider] = {
        status: 'error',
        configured: false
      };
    }
  }

  res.json({
    timestamp: new Date().toISOString(),
    providers: healthStatus
  });
});

module.exports = router;



