const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

exports.transcribeAudio = async (audioPath) => {
  try {
    const filePath = path.resolve(audioPath); // Use local file directly

    // Convert MP3 to WAV
    const wavPath = filePath.replace('.mp3', '.wav');
    await new Promise((resolve, reject) => {
      exec(`ffmpeg -i "${filePath}" -ar 16000 -ac 1 -c:a pcm_s16le "${wavPath}"`, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Run Whisper transcription
    const transcription = await new Promise((resolve, reject) => {
      exec(`whisper "${wavPath}" --language English --model base`, (err, stdout) => {
        if (err) {
          reject(err);
        } else {
          resolve(stdout.trim());
        }

        // Clean up temp file
        fs.unlinkSync(wavPath);
      });
    });

    console.log('Transcription:', transcription);

    // Save transcription to Supabase database
    const { data, error } = await supabase
        .from('transcriptions') // Ensure this table exists
        .insert([{ audio_path: filePath, transcription }]);

    if (error) {
      console.error('Error saving transcription:', error);
      throw error;
    }

    console.log('Transcription saved to database:', data);
    return transcription;
  } catch (error) {
    console.error('Error processing transcription:', error);
    throw error;
  }
};
