const GeneralAgent = require('./src/general_agent');
const GeneratorAgent = require('./src/generator_agent');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

let agentList = {};

function addAgent( a ) {
    agentList[ a.getUUID()] = a;
    console.log("agentList:");
    console.log(JSON.stringify(agentList));
}

app.use(cors());
app.use(bodyParser.json());
/* app.use(bodyParser.urlencoded({ extended: true })); */

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

app.post('/update-agent', (req, res) => {
    const agentUUID = req.body.uuid;
    console.log("/update-agent called with data " + JSON.stringify(req.body));
    agentList[agentUUID].setName(req.body.name);
    agentList[agentUUID].setSystemPrompt(req.body.systemPrompt);
    agentList[agentUUID].setUserPrompt(req.body.userPrompt);
    agentList[agentUUID].setOutputPrompt(req.body.outputPrompt);
    
    res.json({
          version:   agentList[agentUUID].getVersion(),
          signature: agentList[agentUUID].getSignature()
    });

});

app.get('/agent-state', (req, res) => {
    const agentID = req.query.agentID;
    console.log("agentID from query = " + agentID);
    const agentState = agentList[agentID].save();
    const agentStateJSON = JSON.stringify(agentState);
    console.log("agentState=" + agentStateJSON);
    res.json(agentStateJSON);
});

const standardTools = [
  { id: 'ST1', name: 'Initiator',       type: 'initiator-agent', color: 'green'},
  { id: 'ST2', name: 'Input Agent',     type: 'input-agent',     color: 'red' },
  { id: 'ST3', name: 'Standard Agent',  type: 'standard-agent',  color: 'blue' },
  { id: 'ST4', name: 'Generator Agent', type: 'generator-agent', color: 'blue' },
  { id: 'ST5', name: 'Output Agent',    type: 'output-agent',    color: 'yellow' }
];

app.get('/standard-tools', (req, res) => {
   res.json(standardTools);
});

app.post('/drop-cell', (req, res) => {
  const receivedAgent = req.body.agent;
  const receivedRow  = req.body.disprow;
  const receivedCol  = req.body.dispcol;
  console.log("/drop-cell: " + receivedRow + ", " + receivedCol);
  if (receivedAgent == "standard-agent"){
      const newAgent = new GeneralAgent(receivedAgent, receivedRow, receivedCol);
      addAgent(newAgent);
      res.json({
          uuid:      newAgent.getUUID(),
          type:      newAgent.getType(),
          name:      newAgent.getName(),
          signature: newAgent.getSignature()
      });
  } else if (receivedAgent == "generator-agent"){
      const newAgent = new GeneratorAgent(receivedAgent, receivedRow, receivedCol);
      addAgent(newAgent);
      res.json({
          uuid:      newAgent.getUUID(),
          type:      newAgent.getType(),
          name:      newAgent.getName(),
          signature: newAgent.getSignature()
      });
  } else {
      res.json({
          uuid : 'unrecognizedagent',
          type : receivedAgent,
          signature: '0|0|' + receivedAgent
          });
  };
});

const PORT = 3000;
const IP_ADDRESS = '51.38.71.89';

app.listen(PORT, IP_ADDRESS, () => {
  console.log(`Server running at http://${IP_ADDRESS}:${PORT}/`);
});

