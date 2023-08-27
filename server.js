require('dotenv').config();
const bcrypt = require('bcrypt');

const AgentStore = require('./src/agent_store');

const apiKey = process.env.OPENAI_SECRET_KEY;

console.log("API Key:", apiKey);

const GeneralAgent = require('./src/general_agent');
const GeneratorAgent = require('./src/generator_agent');
const InitiatorAgent = require('./src/initiator_agent');
const OutputAgent = require('./src/output_agent');
const MergeAgent = require('./src/merge_agent');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

//
// Create the new agent store to hold all agent details.
//
myAgentStore = new AgentStore();

app.use(cors());
app.use(bodyParser.json());
/* app.use(bodyParser.urlencoded({ extended: true })); */

/********************************
 * USER DETAILS DATABASE SCHEMA *
 ********************************/
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username:   { type: String, required: true, unique: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    useownkey:  { type: Boolean, required: true, default: false},
    tokensused: { type: Number, required: true, default: 0}
});

const User = mongoose.model('User', userSchema);

// Create new users
async function createHash( p ){
    const hashedPassword = await bcrypt.hash(p, 10);
    return hashedPassword;
}
const userMark = new User({ username: "markp", email: "markpearce47@gmail.com", password: createHash("4543mark"), useownkey: false, tokensused: 0 });
await userMark.save();
const userLewis = new User({ username: "lewis", email: "lewisbrereton@outlook.com", password: createHash("tfx2309"), useownkey: false, tokensused: 0 });
await userLewis.save();

app.post('/login', (req, res) => {
   const username = req.body.username;
   const password = req.body.password;
   const tokenstr = {token: "12345"};
   console.log("/login " + username + ", " + password );
   res.json(tokenstr);
});

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
    const agentType = myAgentStore.getAgent(agentUUID).getType();
    if (agentType == "standard-agent" || agentType == "generator-agent"){
        myAgentStore.getAgent(agentUUID).setName(req.body.name);
        myAgentStore.getAgent(agentUUID).setSystemPrompt(req.body.systemPrompt);
        myAgentStore.getAgent(agentUUID).setUserPrompt(req.body.userPrompt);
        myAgentStore.getAgent(agentUUID).setOutputPrompt(req.body.outputPrompt);
    } else if (agentType == "output-agent" || agentType == "merge-agent" ) {
        myAgentStore.getAgent(agentUUID).setName(req.body.name); 
    }
    res.json({
          version:   myAgentStore.getAgent(agentUUID).getVersion(),
          signature: myAgentStore.getAgent(agentUUID).getSignature()
    });

});

app.post('/drop-on-output', (req, res) => {
    try{
        const toAgent = req.body.toAgent;
        const fromAgent = req.body.fromAgent;
        console.log("/drop-on-output " + toAgent + ", " + fromAgent);
    }
    catch (error){
    }
});

app.post('/run-agent', (req, res) => {
    try{
        const agentID = req.body.agentID;
        if (myAgentStore.checkAgentExists(agentID)){
            myAgentStore.getAgent(agentID).execute();
            const agentOP = myAgentStore.getAgent(agentID).getOutput();
            const agentOPJSON = JSON.stringify(agentOP);
            console.log("Output= " + agentOPJSON);
            res.json(agentOPJSON);
        } else {
          res.status(400).send('Agent Entity <' + agentID + '> does not exist.');
        }
    } 
    catch (error){
        console.log("Error: " + error);
        res.status(500).send('Internal Error in /run-agent');
    }
});

app.post('/agent-state', (req, res) => {
    try{
        const agentID = req.body.agentID;
        if(myAgentStore.checkAgentExists(agentID)){
            const agentState = myAgentStore.getAgent(agentID).save();
            const agentStateJSON = JSON.stringify(agentState);
            res.json(agentStateJSON);
        } else {
          res.status(400).send('Agent Entity <' + agentID + '> does not exist.');
        }
    }
    catch (error){
        console.log("Error: " + error);
        res.status(500).send('Internal Error in /agent-state');
    }
});

const standardTools = [
  { id: 'ST1', name: 'Initiator',       type: 'initiator-agent', color: 'green'},
  { id: 'ST2', name: 'Input Agent',     type: 'input-agent',     color: 'red' },
  { id: 'ST3', name: 'Standard Agent',  type: 'standard-agent',  color: 'blue' },
  { id: 'ST4', name: 'Generator Agent', type: 'generator-agent', color: 'blue' },
  { id: 'ST5', name: 'Output Agent',    type: 'output-agent',    color: 'orange' },
  { id: 'ST6', name: 'Merge Agent',     type: 'merge-agent',     color: 'magenta'}
];

app.get('/standard-tools', (req, res) => {
   res.json(standardTools);
});

app.post('/drop-cell', (req, res) => {
  const receivedAgent = req.body.agent;
  const receivedRow  = req.body.disprow;
  const receivedCol  = req.body.dispcol;
  if (receivedAgent == "standard-agent"){
      const newAgent = new GeneralAgent(myAgentStore, receivedAgent, receivedRow, receivedCol, apiKey);
      myAgentStore.add(newAgent);
      res.json({
          uuid:      newAgent.getUUID(),
          type:      newAgent.getType(),
          name:      newAgent.getName(),
          signature: newAgent.getSignature()
      });
  } else if (receivedAgent == "generator-agent"){
      const newAgent = new GeneratorAgent(myAgentStore, receivedAgent, receivedRow, receivedCol, apiKey);
      myAgentStore.add(newAgent);
      res.json({
          uuid:      newAgent.getUUID(),
          type:      newAgent.getType(),
          name:      newAgent.getName(),
          signature: newAgent.getSignature()
      });
  } else if (receivedAgent == "initiator-agent"){
      const newAgent = new InitiatorAgent(myAgentStore, receivedAgent, receivedRow, receivedCol);
      myAgentStore.add(newAgent);
      res.json({
          uuid:      newAgent.getUUID(),
          type:      newAgent.getType(),
          name:      newAgent.getName(),
          signature: newAgent.getSignature()
      });
  } else if (receivedAgent == "output-agent"){
      const newAgent = new OutputAgent(myAgentStore, receivedAgent, receivedRow, receivedCol);
      myAgentStore.add(newAgent);
      res.json({
          uuid:      newAgent.getUUID(),
          type:      newAgent.getType(),
          name:      newAgent.getName(),
          signature: newAgent.getSignature()
      });
  } else if (receivedAgent == "merge-agent"){
      const newAgent = new MergeAgent(myAgentStore, receivedAgent, receivedRow, receivedCol);
      myAgentStore.add(newAgent);
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

