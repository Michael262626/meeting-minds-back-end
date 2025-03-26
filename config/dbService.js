const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();
const fs = require('fs');


const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL or Key is missing.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

exports.storeMeetingData = async (transcript, summary, sentimentAnalysis) => {
  const { data, error } = await supabase
    .from('meetings')
    .insert([
      {
        transcript,
        summary,
        sentiment_score: sentimentAnalysis.score,
        sentiment_analysis: sentimentAnalysis,
      },
    ]);

  if (error) {
    console.error('Error inserting data:', error);
    throw error;
  }

  return data;
};
exports.uploadAudioToSupabase = async (filePath, fileName) => {
  try {
    const fileBuffer = fs.readFileSync(filePath);

    const { data, error } = await supabase.storage.from('audio').upload(fileName, fileBuffer, {
      contentType: 'audio/mp3',
      upsert: true, // Overwrite if file exists
    });

    if (error) throw error;

    const { publicUrl } = supabase.storage.from('audio').getPublicUrl(fileName);

    return publicUrl; // Correct way to access public URL
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw error;
  }
};

exports.getMeetingSummaries = async () => {
  const { data, error } = await supabase.from('meetings').select('*');

  if (error) {
    console.error('Error fetching summaries:', error);
    throw error;
  }

  return data;
};
