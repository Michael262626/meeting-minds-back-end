const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is set
});

const summarizeTranscript = async (transcript) => {
  const prompt = `
Given the following meeting transcript, provide:
1. A concise summary.
2. A list of action items with deadlines and responsible parties (if mentioned).

Transcript:
${transcript}
  `;

  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct", // Updated model (text-davinci-003 is deprecated)
    prompt: prompt,
    max_tokens: 250,
    temperature: 0.5,
  });

  const resultText = response.choices[0].text.trim();
  
  return { fullSummary: resultText };
};

module.exports = { summarizeTranscript };