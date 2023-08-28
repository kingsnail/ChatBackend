const fs = require('fs');

const GeneralAgent   = require('./general_agent');
const GeneratorAgent = require('./generator_agent');
const InputAgent     = require('./input_agent');
const InitiatorAgent = require('./initiator_agent');
const MergeAgent     = require('./merge_agent');
const OutputAgent    = require('./output_agent');

class AgentStore {
    constructor() {
        this.agentList = {};
    }

    /*
     * Check that an agent is present in the Agent Store.
     */
    checkAgentExists( agentUUID ){
        return (agentUUID in this.agentList); 
    }

    /*
     * Return the agent with the corresponding UUID. Returns null if the agent does not exist.
     */
    getAgent( agentUUID ){
         if (this.checkAgentExists( agentUUID )){
           return this.agentList[agentUUID];
         } else {
           return null;
         }
    }

    /*
     * Add a new agent to the store. If it is already in the store the 
     * previous entry will be overwritten.
     */
    add( agent ){
        try{
            this.agentList[ agent.getUUID()] = agent;
        }
        catch {
            console.log("ERROR: AgentStore.add() failed.");
        }
    }
    
    /*
     * Delete the entire contents of the agent store.
     */
    empty(){
        this.agentList = {};
    }

    /* 
     * Save the contents of the agent store.
     */
    save( saveTo ) {
        let agentListSaveObjects = {};
        for (const [key, value] of Object.entries(this.agentList)) {
            agentListSaveObjects[key] = value.save();
        }
        const agentListArchive = { saveName: saveTo, 
                                   saveData: agentListSaveObjects
                                 };
        const agentListArchiveJSON = JSON.stringify(agentListArchive);
        fs.writeFile ("archive.json", agentListArchiveJSON, function(err) { if (err) throw err; console.log('complete'); });
    }

    rebuildStandard(obj){
        const newAgent = new GeneralAgent(obj.name, obj.displayRow, obj.displayCol, obj.apiKey);
        newAgent.load( obj );
        this.add(newAgent);
    }
    rebuildGenerator(obj){
        const newAgent = new GeneratorAgent(obj.name, obj.displayRow, obj.displayCol, obj.apiKey);
        newAgent.load( obj );
        this.add(newAgent);
    }
    rebuildMerge(obj){
        const newAgent = new MergeAgent(obj.name, obj.displayRow, obj.displayCol);
        newAgent.load( obj );
        this.add(newAgent);
    }
    rebuildOutput(obj){
        const newAgent = new OutputAgent(obj.name, obj.displayRow, obj.displayCol);
        newAgent.load( obj );
        this.add(newAgent);
    }
    rebuildInput(obj){
        const newAgent = new InputAgent(obj.name, obj.displayRow, obj.displayCol);
        newAgent.load( obj );
        this.add(newAgent);
    }
    rebuildInitiator(obj){
        const newAgent = new InitiatorAgent(obj.name, obj.displayRow, obj.displayCol);
        newAgent.load( obj );
        this.add(newAgent);
    }

    /*
     * Load a saved agent store
     */
    load( loadFrom ) {
        let self = this;
        fs.readFile('archive.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                const agentListArchive = JSON.parse(data); //now it an object
                const agentListSaveObjects = agentListArchive.saveData;
                
                // Force empty the agent store prior to regenerating
                self.empty();
                for (const [key, obj] of Object.entries(agentListSaveObjects)){
                     console.log("Rebuilld object: " + obj.type + "(" + key + ")" );
                    if (obj.type == 'standard-agent'){
                        self.rebuildStandard( obj );
                    } else if (obj.type == 'generator-agent'){
                        self.rebuildGenerator( obj );
                    } else if (obj.type == 'merge-agent'){
                        self.rebuildMerge( obj );
                    } else if (obj.type == 'output-agent'){
                        self.rebuildOutput( obj );
                    } else if (obj.type == 'input-agent'){
                        self.rebuildInput( obj );
                    } else if (obj.type == 'initiator-agent'){
                        self.rebuildInitiator( obj );
                    } else {
                        console.log("Error: cannot rebuild object type " + obj.type + ", " + key);
                    }
                }
            }
        });
    }

    getAllSignatures(){
        let sigList = {}
        for (const [key, ag] of Object.entries(this.agentList)) {
            const sig = {
                signature:  ag.getSignature(),
                displayRow: ag.getDisplayRow(),
                displayCol: ag.getDisplayCol(),
                type:       ag.getType()
            }
            console.log("sig=" + JSON.stringify(sig));
            sigList[ key ] = sig;
        }
        return sigList;
    }
}

module.exports = AgentStore;
