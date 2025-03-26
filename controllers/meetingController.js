const transcriptionService = require('../services/transcriptionService');
const nlpService = require('../services/nlpService');
const sentimentService = require('../services/sentimentService');
const dbService = require('../config/dbService');

exports.handleMeetingEvent = async (req, res) => {
  try {
    const { audioUrl } = req.body;
    if (!audioUrl) return res.status(400).json({ error: 'Missing audioUrl.' });

    // Download and transcribe the audio
    const transcript = await transcriptionService.transcribeAudio(audioUrl);

    // Generate summary and sentiment analysis
    const summary = await nlpService.summarizeTranscript(transcript);
    const sentimentAnalysis = sentimentService.analyzeTranscript(transcript);

    // Store in Supabase
    const savedMeeting = await dbService.storeMeetingData(transcript, summary.fullSummary, sentimentAnalysis);

    res.status(201).json({ message: 'Meeting processed successfully', data: savedMeeting });
  } catch (error) {
    console.error('Error processing meeting:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.transcribeUploadedAudio = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file uploaded.' });

    const transcript = await transcriptionService.transcribeAudio(req.file.path);
    res.status(200).json({ message: 'Transcription successful', transcript });
  } catch (error) {
    console.error('Error transcribing uploaded audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
};

exports.getSummaries = async (req, res) => {
  try {
    const summaries = await dbService.getMeetingSummaries();
    res.status(200).json(summaries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching summaries' });
  }
};
