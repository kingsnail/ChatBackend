require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');

const AgentStore       = require('./src/agent_store');
const UserSession      = require('./src/user_session');
const ExecutionEngine  = require('./src/execution_engine');
    
const GeneralAgent   = require('./src/general_agent');
const GeneratorAgent = require('./src/generator_agent');
const InitiatorAgent = require('./src/initiator_agent');
const OutputAgent    = require('./src/output_agent');
const MergeAgent     = require('./src/merge_agent');

const express    = require('express');
const mongoose   = require('mongoose');
const bodyParser = require('body-parser');
const cors       = require('cors');

const app = express();

myUserSession = new UserSession("no_user");
myExecutionEngine = new ExecutionEngine();
//
// Create the new agent store to hold all agent details.
//
myAgentStore = new AgentStore();

app.use(cors());
app.use(bodyParser.json());
/* app.use(bodyParser.urlencoded({ extended: true })); */

/*********************************
 * SAVED DATASET DATABASE SCHEMA *
 *********************************/
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

const saveItemSchema = new mongoose.Schema({
    owner: { type: String, required: true },
    name:  { type: String, required: true },
    data:  { type: String},
    toolbox: { type: Boolean, default: false}
});

const DataSet = mongoose.model('DataSets', saveItemSchema);

async function createDataset( d ){
    try {
        const nD = new DataSet(d);
        await nD.save()
        console.log("Saved Data Set");
    } catch (error){
        console.log("Error: createDataset: " + error );
    }
}

async function getDataSet( name, user ){
    try{
        const query = { name: name,
                        owner: user
                      };
        const data = await DataSet.findOne(query);
        console.log("getDataSet = " + JSON.stringify(data));
        return data;
    }
    catch (error){
        console.log("Error: getDataSet " + error);
    }
}

async function listAllDatasets( user) {
    try {
        console.log("listAllDatasets()");
        const query = { owner: user };
        const list = await DataSet.find( query );
        let dataSetsList = [];
        for (var i = 0, l = list.length; i < l; i++) {
             console.log("..adding " + list[i].name);
             dataSetsList.push({name: list[i].name});
        }        
        console.log("listAllDatasets = " + JSON.stringify( dataSetsList ));
        return dataSetsList;
    } catch (error){
        console.log("Error: listAllDatasets " + error);
    }
}

/********************************
 * USER DETAILS DATABASE SCHEMA *
 ********************************/
const userSchema = new mongoose.Schema({
    username:   { type: String, required: true, unique: true },
    email:      { type: String, required: true, unique: true },
    password:   { type: String, required: true },
    useownkey:  { type: Boolean, required: true, default: false},
    ownkey:     { type: String, required: false},
    tokensused: { type: Number, required: true, default: 0}
});

const User = mongoose.model('User', userSchema);

async function getUser( username ){
    try{
        const user = await User.findOne({username});
        console.log("getUser = " + JSON.stringify(user));
        return user;
    }
    catch (error){
        console.log("Error: getUser " + error);
    }
}

async function updateUserDetails( apiKey, useKey, user){
    const filter = { username: user };
    const update = { $set: { ownkey: apiKey, useownkey: useKey } };

    User.updateOne(filter, update).exec()
       .then(result => {
           console.log('Document updated successfully');
       })
       .catch(err => {
           console.error(err);
       });
}

async function validateUser( username, password ){
    try{
        const user = await User.findOne({ username });
        const pcheck = await bcrypt.compare(password, user.password);
        return (user && pcheck);
    }
    catch (error){
        console.log("Error in validateUser.");
    }
    return false;
}

// Create new users
async function createHash( p ){
    console.log("createHash(" + p + ")");
    try{
        const salt = await bcrypt.genSalt(10);
        const hashPwd = await bcrypt.hash(p, salt);
        console.log("Done " + hashPwd);
        return hashPwd;
    }
    catch (error) {
        console.log("Error hashing: " + error);
    }
}

async function createUser( u, e, p, k, ok, t){
    console.log("p=" + JSON.stringify(p));
    try{
        const hP = await createHash( p );
        const nU = new User({ username: u, email: e, password: hP, useownkey: k, ownkey: ok, tokensused: t });
        await nU.save();
    }
    catch (error){
        console.log("Save User Error: "  + error);
    }
}

console.log("Creating Users...");
createUser("markp", "markpearce47@gmail.com", "4543mark", false, '', 0 );
createUser("lewis", "lewisbrereton@outlook.com", "tfx2309", false, '', 0 );

/********************************
 *           /login             *
 ********************************/
app.post('/login', (req, res) => {
   const username = req.body.username;
   const password = req.body.password;
   console.log("/login " + username + ", " + password );
   if (validateUser(username, password)) {
      getUser( username ).then((user) => {
            console.log("Read User=" + user);
            myUserSession.setUserId(user._id);
            myUserSession.setUserName(username);
            myAgentStore.setSessionStore(myUserSession);
            myExecutionEngine.setUserName(username);
            myExecutionEngine.setAgentStore(myAgentStore);
            if(user.useownkey) {
                myUserSession.setApiKeyToUse(user.ownkey);
            } else {
                myUserSession.setApiKeyToUse(process.env.OPENAI_SECRET_KEY);
            }
            console.log(typeof user);
            console.log("user._id=" + user._id);
            const userObj = { username: user.username, id: user._id };
            const token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({token: token});
      });
} else {
     res.status(401).send('User does not exist or incorrect password.');}    
});

/**********************
 * VERIFY LOGIN TOKEN *
 **********************/
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;

        jwt.verify(req.token, process.env.JWT_SECRET, (err, authData) => {
            if (err) {
                res.sendStatus(403); // Forbidden
            } else {
                req.user = authData;
                next();
            }
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
}

/********************************
 *           /register          *
 ********************************/
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

/********************************
 *           /list-datasets     *
 ********************************/
app.post('/list-datasets', verifyToken, (req, res) => {
    console.log("/list-datasets called with data " + JSON.stringify(req.body));
    const user = myUserSession.getUserId();
    console.log("Listing datasets for user " + user);
    listAllDatasets( user).then(( listOfDataSets ) => {
        res.json(JSON.stringify({listOfDataSets}));    
    });
});

/********************************
 *           /execute           *
 ********************************/
app.post('/execute', verifyToken, (req, res) => {
    console.log("/execute called with data " + JSON.stringify(req.body));
    const name = req.body.name;
    const user = myUserSession.getUserId();
    if(myExecutionEngine.isRunning()){
        myExecutionEngine.stop()
    } else {
        myExecutionEngine.run(); 
    }
    res.json({isRunning: myExecutionEngine.isRunning()});
});


/********************************
 *           /load              *
 ********************************/
app.post('/load', verifyToken, (req, res) => {
    console.log("/load called with data " + JSON.stringify(req.body));
    const name = req.body.name;
    const user = myUserSession.getUserId();
    console.log("Loading " + name + " for user " + user);
    getDataSet( name, user).then((dataRecord) => {
        if (dataRecord.data){
            myAgentStore.load(dataRecord.data);
            res.json({status: "ok"});    
        } else {
            console.log("Error onload. dataRecord = " + JSON.stringify(dataRecord));
        }
    });
    
});

/********************************
 *           /save              *
 ********************************/
app.post('/save', verifyToken, (req, res) => {
    console.log("/save called with data " + JSON.stringify(req.body));
    const saveName = req.body.name;
    const saveToolBox = req.body.toolbox;
    const userId = myUserSession.getUserId();
    console.log("Saving " + saveName + ", " + saveToolBox + " for " + userId);
    createDataset(myAgentStore.save(saveName, saveToolBox, userId));
    res.json({status: "ok"});
});

/********************************
 *           /update-agent      *
 ********************************/
app.post('/update-agent', verifyToken, (req, res) => {
    const agentUUID = req.body.uuid;
    console.log("/update-agent called with data " + JSON.stringify(req.body));
    const agentType = myAgentStore.getAgent(agentUUID).getType();
    if (agentType == "standard-agent" || agentType == "generator-agent"){
        myAgentStore.getAgent(agentUUID).setName(req.body.name);
        myAgentStore.getAgent(agentUUID).setSystemPrompt(req.body.systemPrompt);
        myAgentStore.getAgent(agentUUID).setUserPrompt(req.body.userPrompt);
        myAgentStore.getAgent(agentUUID).setOutputPrompt(req.body.outputPrompt);
        myAgentStore.getAgent(agentUUID).setListItemOutput(req.body.listItemOutout);p
    } else if (agentType == "output-agent" || agentType == "merge-agent" ) {
        myAgentStore.getAgent(agentUUID).setName(req.body.name); 
    }
    res.json({
          version:   myAgentStore.getAgent(agentUUID).getVersion(),
          signature: myAgentStore.getAgent(agentUUID).getSignature()
    });

});

/********************************
 *           /signatures        *
 ********************************/
app.post('/signatures', verifyToken, (req, res) => {
    console.log("/signatures");
    let sigList = myAgentStore.getAllSignatures();
    res.json(sigList);
});

/********************************
 *           /get-user-settings *
 ********************************/
app.post('/get-user-settings', verifyToken, (req, res) => {
    console.log("/get-user-settings" + JSON.stringify(req.body));
    getUser( myUserSession.getUserName() ).then( (userRecord) => {
        if (userRecord){
           res.json(userRecord);
        } else {
           res.json("Error");
        }
    });
});

/********************************
 *           /update-user-settings *
 ********************************/
app.post('/update-user-settings', verifyToken, (req, res) => {
    console.log("/update-user-settings" + JSON.stringify(req.body));
    const apiKey = req.body.apiKey;
    const useOwnKey = req.body.useOwnApiKey;
    getUser( myUserSession.getUserName() ).then( (userRecord) => {
        if (userRecord){
           userRecord.ownkey = apiKey;
           userRecord.useownkey = useOwnKey;
           updateUserDetails( apiKey, useOwnKey, myUserSession.getUserName()).then(() => {
                if(userRecord.useownkey) {
                    myUserSession.setApiKeyToUse(userRecord.ownkey);
                } else {
                    myUserSession.setApiKeyToUse(process.env.OPENAI_SECRET_KEY);
                }
               res.json(userRecord);       
           });
        } else {
           res.json("Error");
        }
    });
});

/********************************
 *           /names             *
 ********************************/
app.post('/names', verifyToken, (req, res) => {
    console.log("/names");
    let nameList = myAgentStore.getNameIndex();
    res.json(nameList);
});


/********************************
 *           /drop-on-output    *
 ********************************/
app.post('/drop-on-output', verifyToken, (req, res) => {
    try{
        const toAgent = req.body.toAgent;
        const fromAgent = req.body.fromAgent;
        console.log("/drop-on-output " + toAgent + ", " + fromAgent);
        if (myAgentStore.checkAgentExists(toAgent) && myAgentStore.checkAgentExists(fromAgent)){
             myAgentStore.getAgent(toAgent).subscribe(fromAgent);
             myAgentStore.getAgent(fromAgent).addSubscription(toAgent);
             console.log("..subscribed");
        }
    }
    catch (error){
    }
});

/********************************
 *           /run-agent         *
 ********************************/
app.post('/run-agent', verifyToken, (req, res) => {
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

/********************************
 *           /agent-state       *
 ********************************/
app.post('/agent-state', verifyToken, (req, res) => {
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

/********************************
 *           /standard-tools    *
 ********************************/
const standardTools = [
  { id: 'ST1', name: 'Initiator',       type: 'initiator-agent', color: 'green'},
  { id: 'ST2', name: 'Input Agent',     type: 'input-agent',     color: 'red' },
  { id: 'ST3', name: 'Standard Agent',  type: 'standard-agent',  color: 'blue' },
  { id: 'ST4', name: 'Generator Agent', type: 'generator-agent', color: 'blue' },
  { id: 'ST5', name: 'Output Agent',    type: 'output-agent',    color: 'orange' },
  { id: 'ST6', name: 'Merge Agent',     type: 'merge-agent',     color: 'magenta'}
];

app.get('/standard-tools', verifyToken, (req, res) => {
   res.json(standardTools);
});

/********************************
 *           /user-tools        *
 ********************************/
app.get('/user-tools', verifyToken, (req, res) => {
   const userTools = [
      { id: 'UT1', name: 'User Tool',  type: 'user-tool', color: 'lightgreen'}
       ];
   res.json(userTools);
});

/********************************
 *           /drop-cell         *
 ********************************/
app.post('/drop-cell', verifyToken, (req, res) => {
  const receivedAgent = req.body.agent;
  const receivedRow  = req.body.disprow;
  const receivedCol  = req.body.dispcol;
  const apiKey = myUserSession.getApiKeyToUse();
  console.log("/drop-cell = " + JSON.stringify(req.body));
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

