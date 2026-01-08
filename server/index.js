require('dotenv').config();
require('./utils/constants.js');
const express = require('express');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ limit: '500mb', extended: true }));

app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_DB_CONNECTION_URL)
  .then(() => {
    console.info(`Database connected successfully`);
  })
  .catch((err) => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

app.use('/v1/bot-chats', require('./routes/botChats.js'));

app.get('/', (req, res) => res.send('Welcome to the server'));
app.get('/v1', (req, res) => res.send('You are now accessing API version:1'));

server.listen(PORT, () => {
  console.info(`Server running on http://localhost:${PORT}`);
  console.info(`Environment: ${process.env.ENVIRONMENT_STATUS}`);
});
