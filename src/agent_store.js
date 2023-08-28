tyconst fs = require('fs');

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

    /*
     * Load a saved agent store
     */
    load( loadFrom ) {
        fs.readFile('archive.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
                const agentListArchive = JSON.parse(data); //now it an object
                const agentListSaveObjects = agentListArchive.saveData;
                
                // Force empty the agent store prior to regenerating
                this.empty();
                for (const [key, agentSaveObject] of Object.entries(agentListSaveObjects)){
                     console.log("Rebuilld object: " + agentSaveObject.type + "(" + key + ")" );
                }
            }
        });
    }
}

module.exports = AgentStore;
