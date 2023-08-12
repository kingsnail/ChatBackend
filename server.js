const GeneralAgent = require('./src/general_agent');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  username: String,
  password: String
});

const User = mongoose.model('User', userSchema);

app.post('/register', (req, res) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  newUser.save(err => {
    if (err) {
      res.status(400).send('Error registering user.');
    } else {
      res.status(200).send('User registered successfully!');
    }
  });
});


const standardTools = [
  { id: 'ST1', name: 'Initiator',      type: 'initiator-agent', color: 'red'},
  { id: 'ST2', name: 'Input Agent',    type: 'input-agent',     color: 'blue' },
  { id: 'ST3', name: 'Standard Agent', type: 'standard-agent',  color: 'green' },
  { id: 'ST4', name: 'Output Agent',   type: 'output-agent',    color: 'yellow' }
];

app.get('/standard-tools', (req, res) => {
   res.json(standardTools);
});

app.post('/drop-cell', (req, res) => {
  const receivedAgent = req.body.agent;
  const receivedCell  = req.body.cell;
  if (receivedAgent == "standard-agent"){
      const newAgent = new GeneralAgent(receivedAgent, receivedCell);
      res.json({
          uuid: newAgent.getUUID(),
          type: receivedAgent,
          description: 'This is a description based on received data.'
      });
  } else {
      res.json({
          uuid : 'xxxx',
          type : receivedAgent,
          description: `Received: ${receivedAgent} in cell ${receivedCell}`,
          });
  };
});

const PORT = 3000;
const IP_ADDRESS = '51.38.71.89';

app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server running at http://${IP_ADDRESS}:${PORT}/`);
});

