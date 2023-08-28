const fs = require('fs');

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
        console.log("rebuild");
    }
    rebuildGenerator(obj){
        console.log("rebuild");
    }
    rebuildMerge(obj){
        console.log("rebuild");
    }
    rebuildOutput(obj){
        console.log("rebuild");
    }
    rebuildInput(obj){
        console.log("rebuild");
    }
    rebuildInitiator(obj){
        console.log("rebuild");
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
}

module.exports = AgentStore;
