const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { clearChannel, clearAllMessages } = require('./app/clear');
const config = require('./config.json');

const app = express();
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/credits.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'credits.html'));
});

app.post('/clear-channel', async (req, res) => {
  const { token, channelId } = req.body;
  try {
    const result = await clearChannel(token, channelId);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error in clear-channel:', error);
    res.status(500).json({ message: 'Ocorreu um erro ao processar sua solicitação.' });
  }
});

app.post('/clear-all', async (req, res) => {
  const { token } = req.body;
  try {
    const result = await clearAllMessages(token);
    res.status(result.status).json(result);
  } catch (error) {
    console.error('Error in clear-all:', error);
    res.status(500).json({ message: 'Ocorreu um erro ao processar sua solicitação.' });
  }
});

app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});

