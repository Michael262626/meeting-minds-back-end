const Sentiment = require('sentiment');
const sentiment = new Sentiment();

exports.analyzeTranscript = (transcript) => {
  const analysis = sentiment.analyze(transcript);
  return {
    score: analysis.score,
    comparative: analysis.comparative,
    positive: analysis.positive,
    negative: analysis.negative,
    tokens: analysis.tokens,
  };
};
