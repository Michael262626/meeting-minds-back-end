const express = require('express');
const multer = require('multer');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

const storage = multer.diskStorage({
    destination: 'upload/',
    filename: (req, file, cb) => {
        const safeName = file.originalname.replace(/\s+/g, '_'); // Replace spaces with underscores
        cb(null, `${Date.now()}-${safeName}`);
    },
});

const upload = multer({ storage });

// Endpoint to receive meeting webhook events
router.post('/webhook', meetingController.handleMeetingEvent);
router.post('/transcribe', upload.single('audio'), meetingController.transcribeUploadedAudio);

// Endpoint to retrieve meeting summaries (sample response, no DB used)
router.get('/summaries', meetingController.getSummaries);

module.exports = router;
