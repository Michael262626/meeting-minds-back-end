require('dotenv').config();
const express = require('express');
const someModule = require('some-module'); 
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// API routes
app.use('/api', apiRoutes);

// d (if needed)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log("API Routes Loaded:", apiRoutes.stack.map(layer => layer.route?.path).filter(Boolean));
});
